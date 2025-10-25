import React from 'react'
import { useState, useEffect } from "react"
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AttractionItem } from '@/components/AttractionItem'
import { useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'

export default function SortableItem({ id, boardId, isAnyDragging }) {
    const item = useSelector((state) => state.boards.itemsById[id])

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({
        id,
        data: {
            type: 'item',
            boardId: boardId,
        },
        animateLayoutChanges: (args) =>
            defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'transform 250ms ease' : transition,
        border: isOver ? '2px solid #007bff' : '1px solid #ccc',
        borderRadius: '8px',
        background: isDragging ? '#f0f0f0' : (isOver ? '#f0f8ff' : 'white'),
        cursor: isDragging ? 'grabbing' : 'grab',
        boxSizing: 'border-box',
        position: 'relative',
        padding: '1px',
    }

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{ ...style, touchAction: 'none' }}
            data-item-id={id}

        >
            <AttractionItem
                image={item?.image || 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg'}
                title={item?.title || 'Attraction'}
                duration={item?.duration || ''}
                timeline={item?.timeline || ''}
                timeOfDay={item?.timeOfDay || ''}
                location={item?.location || ''}
                description={item?.description || ''}
                isDragging={isDragging || isAnyDragging}
            />
        </Card>
    )
}