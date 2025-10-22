import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from './SortableItem'
import { useDispatch } from 'react-redux'
import { reserveBoardToTemplate } from '@/newLIstBoardFeature/thunk'
import { Card, CardContent } from '@/components/ui/card'
import { GripHorizontal, Trash2 } from 'lucide-react'
import { parseISO, format } from 'date-fns'

export default function Board({ board, isAnyDragging, suppressSyncRef }) {
    const dispatch = useDispatch()

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: board.id,
        data: {
            type: 'board',
            boardId: board.id,
        },
    })

    const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
        id: `droppable-${board.id}`,
        data: {
            type: 'container',
            boardId: board.id
        },
    })

    const handleReserveBoard = (e) => {
        suppressSyncRef.current = true
        e.stopPropagation()
        dispatch(reserveBoardToTemplate(board.id))
        setTimeout(() => {
            suppressSyncRef.current = false
        }, 300);
    }

    const boardDateDisplay = board?.date ? format(parseISO(board.date), 'MMM d, yyyy') : ''

    return (
        <div
            ref={setNodeRef}
            data-board-id={board.id}
            data-board-type="draggable-board"
        >

            <Card className="w-[180px] overflow-hidden gap-1 rounded-2xl shadow-lg p-2 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">


                {/* --- HEADER SECTION (With Drag Handle and Button) --- */}
                <div className="flex justify-between items-center px-3">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-gray-500 p-1"
                        style={{ touchAction: 'none' }} // Recommended for touch devices
                    >
                        <GripHorizontal className="h-5 w-5" />
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={handleReserveBoard}
                        onMouseDown={(e) => e.stopPropagation()} // Extra precaution
                        className="bg-transparent border-none text-gray-500 hover:text-red-500 cursor-pointer p-1 rounded-md"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Date label */}
                    <div className="text-xs text-gray-500 mt-1">
                        {boardDateDisplay}
                    </div>
                </div>


                {/* Main Image */}
                <div className="h-20 w-full rounded-t-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop"
                        alt="Hotel"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Content */}
                <CardContent className="p-1">
                    {/* Header */}
                    <h5 className="font-semibold text-gray-700 text-xs text-center">Attraction Timeline</h5>

                    {/* Items */}
                    <div className="divide-y flex-1 flex flex-col gap-2 rounded-md transition-all duration-200 ease-in-out relative border-dashed ${isOver 
            ? 'border-[3px] border-blue-500 bg-blue-500/5' 
            : 'border-2 border-transparent bg-transparent'
        }"

                        ref={setDroppableNodeRef}

                    >
                        <SortableContext
                            id={board.id}
                            items={board.items}
                            strategy={verticalListSortingStrategy}
                        >
                            {board.items.map((itemId) => (
                                <SortableItem
                                    key={itemId}
                                    id={itemId}
                                    boardId={board.id}
                                    isAnyDragging={isAnyDragging || isDragging}
                                />
                            ))}
                        </SortableContext>

                        {/* --- EMPTY STATE --- */}
                        {board.items.length === 0 && (
                            <div className="text-center text-gray-500 text-sm italic py-3 px-3.5 border border-dashed border-gray-300 rounded-xl">
                                Drop items here
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}