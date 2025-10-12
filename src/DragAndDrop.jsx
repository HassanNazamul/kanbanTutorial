import React, { useState } from 'react'
import Board from './features/Board'
import { useSelector, useDispatch } from 'react-redux'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { moveBoard, moveItemWithinBoard, moveItemAcrossBoards } from './features/boardSlice'
import SortableItem from './features/SortableItem'
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'

function DragAndDrop() {
  const { boards, boardOrder } = useSelector((state) => state.boards)
  const dispatch = useDispatch()
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null)

  // Determine if anything is being dragged
  const isAnyDragging = activeId !== null

  const handleDragEnd = (event) => {
    const { active, over } = event
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
    setActiveId(event.active.id)
    const type = event.active.data.current?.type
    setActiveType(type)
    console.log('Drag Start:', { id: event.active.id, type })
  }

  return (
    <div style={{ padding: 10 }}>
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
        <SortableContext items={boardOrder} strategy={rectSortingStrategy}>
          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>
            {boardOrder.map((boardId) => (
              boards[boardId] && 
              <Board
                key={boardId}
                board={boards[boardId]}
                isAnyDragging={isAnyDragging}
              />
            ))}
          </div>
        </SortableContext>
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