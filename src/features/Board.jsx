import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import SortableItem from './SortableItem'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { reserveBoardToTemplate } from '@/newLIstBoardFeature/thunk'
import { Card, CardContent } from '@/components/ui/card'

export default function Board({ board, isAnyDragging }) {
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
        e.stopPropagation()
        dispatch(reserveBoardToTemplate(board.id))
    }

    return (
        <div
            ref={setNodeRef}
            data-board-id={board.id}
            data-board-type="draggable-board"
            {...attributes}
            {...listeners}
        >

            <Card className="overflow-hidden gap-2 rounded-2xl shadow-lg p-2 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                {/* Main Image */}
                <div className="h-20 w-full rounded-t-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop"
                        alt="Hotel"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Content */}
                <CardContent className="p-1 border-t">
                    {/* Header */}
                    <h5 className="font-semibold text-gray-700 text-xs text-center">Attraction Timeline</h5>

                    {/* Items */}
                    <div className="divide-y"
                        ref={setDroppableNodeRef}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            border: isOver ? '3px dashed #007bff' : '2px dashed transparent',
                            borderRadius: '6px',
                            padding: isOver ? '8px' : '4px',
                            backgroundColor: isOver ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                        }}
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

                        {/* Empty state indicator */}
                        {board.items.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                color: '#999',
                                padding: '12px 14px',
                                fontStyle: 'italic',
                                border: '1px dashed #ddd',
                                borderRadius: '12px',
                            }}>
                                Drop items here
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}