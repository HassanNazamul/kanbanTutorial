import React from 'react'
import { SortableContext, verticalListSortingStrategy, useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core' // added
import { reserveBoardToTemplate } from '@/newLIstBoardFeature/thunk'
import { useDispatch } from 'react-redux'


export default function Board({ board }) {

    const dispatch = useDispatch() // Initialize dispatch

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id })

    // const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    //     id: board.id,
    //     animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    // })

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
        <div ref={setNodeRef} style={style}>

            <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '6px 0' }}>
                <span>:::</span>

                <strong>{board.title}</strong>
            </div>


            {/* New Reserve/Remove Button */}
            <button
                onClick={handleReserveBoard}
                title="Remove and Reserve to Template List"
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    padding: '4px',
                    marginLeft: '10px'
                }}
            >
                &times; {/* Using the HTML times character for a close/remove icon */}
            </button>

            <div ref={setDroppableNodeRef} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, minHeight: 50 }}>

                <SortableContext items={board.items} strategy={verticalListSortingStrategy} id={board.id}>
                    {board.items.map((itemId) => (
                        <SortableItem key={itemId} id={itemId} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}