import React from 'react'
import { useState, useEffect } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


export default function SortableItem({ id }) {

    const [open, setOpen] = useState(false)


    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id,
        animateLayoutChanges: (args) =>
            defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : 'transform 300ms ease',
        border: '1px solid #ccc',
        padding: '8px 16px',
        borderRadius: '8px',
        background: isDragging ? '#f0f0f0' : 'white',
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    // Close the popover when dragging starts to avoid hover opening while moving
    useEffect(() => {
        if (isDragging) {
            setOpen(false)
        }
    }, [isDragging])


    return (

        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            {id}
        </div>
    )
}
