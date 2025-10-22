import React, { useState, useEffect, useCallback, useRef } from 'react'
import Board from './features/Board'
import { useSelector, useDispatch } from 'react-redux'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { moveBoard, moveItemWithinBoard, moveItemAcrossBoards, setBoardDatesFromBase, addEmptyBoard } from './features/boardSlice'
import SortableItem from './features/SortableItem'
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import HorizontalCalendar from './calendar/HorizontalCalender'
import { parseISO } from 'date-fns'
import { PlaceholderAttractionCard } from './components/PlaceholderAttractionCard'

function DragAndDrop() {



  const calendarRef = useRef(null);
  const [testDate, setTestDate] = useState("");

  const suppressSyncRef = useRef(false)


  const { boards, boardOrder } = useSelector((state) => state.boards)
  const dispatch = useDispatch()
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null)

  // Determine if anything is being dragged
  const isAnyDragging = activeId !== null

  // NEW: calendar & carousel API state
  const [calendarApi, setCalendarApi] = useState(null)
  const [cardsApi, setCardsApi] = useState(null)

  useEffect(() => {
    if (!cardsApi) return;

    // listener for when user scrolls (via arrow or drag)
    const onSelect = () => {
      if (suppressSyncRef.current) return;    // ignore if suppression is active
      const snapIdx = cardsApi.selectedScrollSnap();
      const prevSnapIdx = cardsApi.previousScrollSnap();

      if (snapIdx === undefined) return;

      console.log("Cards carousel selected snap index:", snapIdx);
      console.log("Cards carousel previous snap index:", prevSnapIdx);

      const direction = snapIdx > prevSnapIdx ? 1 : -1;

      calendarRef.current?.scrollByOffset(direction);
    };

    // Attach listener
    cardsApi.on("select", onSelect);

    // Cleanup on unmount
    return () => {
      cardsApi.off("select", onSelect);
    };
  }, [cardsApi, calendarRef]);

  // NEW: central selected date state (ISO string)
  // Initialize from the leftmost board's date if present
  const initialSelectedISO = boardOrder && boardOrder.length > 0 && boards[boardOrder[0]] ? boards[boardOrder[0]].date : new Date().toISOString()
  const [selectedDate, setSelectedDate] = useState(initialSelectedISO)

  // When the calendar changes (via HorizontalCalendar), update board dates relative to that base
  const handleCalendarSelectedDateChange = useCallback((dateISO) => {
    if (suppressSyncRef.current) return;  // ignore if suppression is active
    setSelectedDate(dateISO)
    dispatch(setBoardDatesFromBase(dateISO))
    console.log("Calendar selected date changed to:", dateISO)
    if (!cardsApi) return;
    try {
      cardsApi.scrollTo(0)
    } catch (err) {
      console.warn("cardsApi scrollTo(0) failed", err)
    }
  }, [dispatch, cardsApi])


  // When calendarApi is set, we can also hook into calendarApi select to keep parent in sync.
  // However we already rely on HorizontalCalendar calling onSelectedDateChange when user clicks arrows or days,
  // so we don't need to add another listener here unless you want Embla events processed.

  // Provide setApi handlers to the Carousel components via props
  // The Carousel will call setApi(api) when the Embla API becomes available.
  // These setter functions will cause the useEffect above to register listeners.

  const handleDragEnd = (event) => {
    const { active, over } = event
    setTimeout(() => { suppressSyncRef.current = false }, 300)
    if (!over) {
      setActiveId(null)
      setActiveType(null)
      return
    }

    // Get types from data
    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    console.log('Drag End:', { activeType, overType, activeId: active.id, overId: over.id })

    // --- BOARD DRAG ---
    if (activeType === 'board') {
      // Only allow dropping on other boards for board reordering
      if (overType === 'board') {
        const oldIndex = boardOrder.indexOf(active.id)
        const newIndex = boardOrder.indexOf(over.id)
        console.log('Board drag indices:', { oldIndex, newIndex, boardOrder })
        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
          dispatch(moveBoard({ oldIndex, newIndex }))
        }
      }
      setActiveId(null)
      setActiveType(null)
      return
    }

    // --- ITEM DRAG ---
    if (activeType === 'item') {
      let fromBoardId = null
      let toBoardId = null

      // Find source board
      fromBoardId = Object.keys(boards).find(boardId =>
        boards[boardId]?.items?.includes(active.id)
      )

      // Find target board
      if (over.data.current?.type === 'container') {
        toBoardId = over.data.current.boardId
      } else if (overType === 'item') {
        toBoardId = Object.keys(boards).find(boardId =>
          boards[boardId]?.items?.includes(over.id)
        )
      } else if (overType === 'board') {
        toBoardId = over.id
      }

      console.log('Item drag boards:', { fromBoardId, toBoardId })

      if (!fromBoardId || !toBoardId) {
        console.warn('DragEnd: could not determine source/dest boards', {
          activeId: active.id,
          overId: over.id,
          fromBoardId,
          toBoardId
        })
        setActiveId(null)
        setActiveType(null)
        return
      }

      // Same-board reorder
      if (fromBoardId === toBoardId) {
        const boardId = fromBoardId
        if (!boards[boardId]) {
          console.warn('Unknown board in same-board branch', boardId)
          setActiveId(null)
          setActiveType(null)
          return
        }

        const oldIndex = boards[boardId].items.indexOf(active.id)
        let newIndex = boards[boardId].items.indexOf(over.id)

        if (newIndex === -1) {
          newIndex = boards[boardId].items.length
        }

        console.log('Same board move:', { oldIndex, newIndex })

        if (oldIndex !== newIndex && oldIndex !== -1) {
          dispatch(moveItemWithinBoard({
            boardId,
            oldIndex,
            newIndex
          }))
        }
      } else {
        // Cross-board move
        if (!boards[fromBoardId] || !boards[toBoardId]) {
          console.error('Invalid board id in cross-board move', {
            fromBoardId,
            toBoardId
          })
          setActiveId(null)
          setActiveType(null)
          return
        }

        let newIndex = boards[toBoardId].items.indexOf(over.id)
        if (newIndex === -1) {
          newIndex = boards[toBoardId].items.length
        }

        console.log('Cross board move:', { newIndex })

        dispatch(moveItemAcrossBoards({
          fromBoardId,
          toBoardId,
          activeId: active.id,
          newIndex
        }))
      }
    }

    setActiveId(null)
    setActiveType(null)
  }

  const handleDragStart = (event) => {
    suppressSyncRef.current = true
    setActiveId(event.active.id)
    const type = event.active.data.current?.type
    setActiveType(type)
    console.log('Drag Start:', { id: event.active.id, type })
  }

  return (
    <div style={{ padding: 10 }}>

      <HorizontalCalendar
        ref={calendarRef}
        selectedDate={selectedDate}
        onSelectedDateChange={handleCalendarSelectedDateChange}
        setCarouselApi={setCalendarApi}
        calendarApi={calendarApi}
        suppressScrollRef={suppressSyncRef}
      />

      {/* <div className="flex items-center gap-2 my-4">
        <button
          onClick={() => calendarRef.current?.scrollByOffset(-1)}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
        >
          ← Prev
        </button>

        <button
          onClick={() => calendarRef.current?.scrollByOffset(1)}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
        >
          Next →
        </button>
      </div> */}

      <DndContext
        collisionDetection={rectIntersection}
        measuring={{
          droppable: {
            strategy: 'always'
          }
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => { setActiveId(null); setActiveType(null) }}
      >
        <Carousel
          setApi={setCardsApi}
          opts={{
            align: "start",
            // This is the crucial part to prevent drag conflicts!
            watchDrag: activeId === null,
          }}
          className="w-full"
          orientation="horizontal"
        >
          <CarouselContent className="-ml-4"> {/* Negative margin to align items correctly */}

            <SortableContext items={boardOrder} strategy={rectSortingStrategy}>
              {boardOrder.map((boardId) => (
                boards[boardId] && (
                  // ✨ CHANGE: Each board is now a CarouselItem
                  <CarouselItem key={boardId} className="pl-4 basis-auto">
                    <Board
                      board={boards[boardId]}
                      isAnyDragging={isAnyDragging}
                      suppressSyncRef={suppressSyncRef}
                    />
                  </CarouselItem>
                )
              ))}
            </SortableContext>

            {/* --- Add Placeholder Card --- */}
            <CarouselItem key="add-placeholder" className="pl-4 basis-auto">
              <PlaceholderAttractionCard
                onAdd={() => {
                  suppressSyncRef.current = true
                  dispatch(addEmptyBoard())
                  // allow one render cycle to complete, then re-enable sync
                  setTimeout(() => { suppressSyncRef.current = false }, 300)
                }}
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>


        <DragOverlay>
          {activeId && activeType === 'item' ? (
            <SortableItem id={activeId} isAnyDragging={isAnyDragging} />
          ) : activeId && activeType === 'board' ? (
            <Board board={boards[activeId]} isAnyDragging={isAnyDragging} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default DragAndDrop