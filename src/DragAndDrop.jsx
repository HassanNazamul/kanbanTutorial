import React, { useState } from 'react'
import Board from './features/Board'
// import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { DndContext, rectIntersection, DragOverlay } from '@dnd-kit/core'

import { useSelector, useDispatch } from 'react-redux'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { moveBoard, moveItemWithinBoard, moveItemAcrossBoards } from './features/boardSlice'
import SortableItem from './features/SortableItem'

function DragAndDrop() {
  const { boards, boardOrder } = useSelector((state) => state.boards)
  const dispatch = useDispatch()
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) {
      setActiveId(null)
      setActiveType(null)
      return
    }

    const isBoardDrag = boardOrder.includes(active.id)
    const isBoardDrop = boardOrder.includes(over.id)

    if (isBoardDrag && isBoardDrop) {
      const oldIndex = boardOrder.indexOf(active.id)
      const newIndex = boardOrder.indexOf(over.id)
      if (oldIndex !== newIndex) dispatch(moveBoard({ oldIndex, newIndex }))
      setActiveId(null)
      setActiveType(null)
      return
    }

    const activeContainer = active.data.current?.sortable?.containerId
    const overContainer = over.data.current?.sortable?.containerId

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      setActiveType(null)
      return
    }

    if (activeContainer === overContainer) {
      const boardId = activeContainer
      const oldIndex = boards[boardId].items.indexOf(active.id)
      const newIndex = boards[boardId].items.indexOf(over.id)
      if (oldIndex !== newIndex) dispatch(moveItemWithinBoard({ boardId, oldIndex, newIndex }))
    } else {
      const fromBoardId = activeContainer
      const toBoardId = overContainer
      const newIndex = boards[toBoardId].items.indexOf(over.id)
      const finalNewIndex = newIndex === -1 ? boards[toBoardId].items.length : newIndex
      dispatch(moveItemAcrossBoards({ fromBoardId, toBoardId, activeId: active.id, newIndex: finalNewIndex }))
    }

    setActiveId(null)
    setActiveType(null)
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
    const isBoard = boardOrder.includes(event.active.id)
    setActiveType(isBoard ? 'board' : 'item')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>DnD Kit + RTK (Horizontal Boards + Smooth Drag)</h1>

      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => { setActiveId(null); setActiveType(null) }}
      >
        <SortableContext items={boardOrder} strategy={rectSortingStrategy}>
          <div style={{ 
            display: 'flex', 
            gap: 20, 
            flexWrap: 'wrap', 
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>
            {boardOrder.map((boardId) => (
              <Board key={boardId} board={boards[boardId]} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && activeType === 'item' ? (
            <SortableItem id={activeId} />
          ) : activeId && activeType === 'board' ? (
            <Board board={boards[activeId]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default DragAndDrop
