import React from 'react'
import { SortableContext, verticalListSortingStrategy, useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core' // added
import { reserveBoardToTemplate } from '@/newLIstBoardFeature/thunk'
import { useDispatch } from 'react-redux'
import { Card, CardContent } from "@/components/ui/card"


export default function Board({ board }) {

    const dispatch = useDispatch() // Initialize dispatch

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id })


    // added droppable so empty boards expose sortable.containerId on "over"
    const { setNodeRef: setDroppableNodeRef } = useDroppable({
        id: board.id,
        data: { sortable: { containerId: board.id } },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: 280,
        padding: 12,
        border: '1px solid #ccc',
        borderRadius: 8,
        background: isDragging ? '#fafafa' : '#fff',
        // boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        visibility: isDragging ? 'hidden' : 'visible',
    }

    // New handler for the reserve/remove action
    const handleReserveBoard = (e) => {
        // Stop event propagation to prevent triggering drag listeners
        e.stopPropagation();

        // Dispatch the thunk to move the board back to the template list
        dispatch(reserveBoardToTemplate(board.id));
    }


    return (
        <Card ref={setNodeRef} style={style}{...attributes} {...listeners} className="overflow-hidden rounded-2xl shadow-lg py-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">


            {/* Main Image */}
            <div className="h-36 w-full">
                <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop"
                    alt="Hotel"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <CardContent className="px-4 pb-2">
                {/* Header */}
                <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm">
                        Time to Cover Attraction
                    </h3>
                    <h3 className="font-semibold text-gray-700 text-sm">Timeline</h3>
                </div>

                {/* Items */}
                <div className="divide-y" ref={setDroppableNodeRef}>

                    <SortableContext items={board.items} strategy={verticalListSortingStrategy} id={board.id}>
                        {board.items.map((itemId) => (
                            <SortableItem key={itemId} id={itemId} />
                        ))}
                    </SortableContext>

                </div>
            </CardContent>
        </Card>
    )
}