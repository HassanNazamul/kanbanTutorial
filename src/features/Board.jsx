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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'transform 250ms ease' : transition,
        width: 280,
        minHeight: 200,
        padding: 12,
        border: '1px solid #ccc',
        borderRadius: 8,
        background: isDragging ? '#fafafa' : (isOver ? '#f0f8ff' : '#fff'),
        display: 'flex',
        flexDirection: 'column',
        opacity: isDragging ? 0.5 : 1,
        boxSizing: 'border-box',
    }

    const handleReserveBoard = (e) => {
        e.stopPropagation()
        dispatch(reserveBoardToTemplate(board.id))
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            data-board-id={board.id}
            data-board-type="draggable-board"
        >
            {/* Enhanced drag handle */}
            <div
                {...attributes}
                {...listeners}
                style={{
                    cursor: 'grab',
                    padding: '12px 8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isDragging ? '#e6f7ff' : '#f5f5f5',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    userSelect: 'none',
                    position: 'relative',
                    zIndex: 10,
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <span style={{
                    fontSize: '18px',
                    marginRight: '8px',
                    cursor: 'grab'
                }}>:::</span>
                <strong style={{ flex: 1, cursor: 'grab' }}>{board.title}</strong>
                <button
                    onClick={handleReserveBoard}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Remove and Reserve to Template List"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer',
                        fontSize: '1.2em',
                        padding: '4px',
                    }}
                >
                    &times;
                </button>
            </div>

            <Card className="overflow-hidden rounded-2xl shadow-lg py-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
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
                    <div className="divide-y"
                        ref={setDroppableNodeRef}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            minHeight: 100,
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
                                padding: '20px',
                                fontStyle: 'italic',
                                border: '2px dashed #ddd',
                                borderRadius: '4px',
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