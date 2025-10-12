// import Redux Toolkit helper to create a slice with reducers and actions
import { createSlice } from '@reduxjs/toolkit'
// import arrayMove utility to reorder arrays immutably
import { arrayMove } from '@dnd-kit/sortable'

/**
 * Redux slice for Kanban-style boards.
 *
 * State shape:
 * {
 *   boards: {
 *     boardId: {
 *       id: string,
 *       title: string,
 *       items: string[]    // ordered list of item ids
 *     },
 *     ...
 *   },
 *   boardOrder: string[]   // ordered list of board ids
 * }
 *
 * This slice manages:
 *  - reordering items within a single board
 *  - moving an item from one board to another
 *  - reordering boards themselves
 */
// initial application state for boards and their order
const initialState = {
    // object mapping board id -> board data
    boards: {
        // example board with id, display title and ordered array of item ids
        board1: {
            id: 'board1',
            title: 'Board One',
            items: ['item-1'],
        },
        board2: {
            id: 'board2',
            title: 'Board Two',
            items: ['item-4'],
        },
        board3: {
            id: 'board3',
            title: 'Board Three',
            items: ['item-7'],
        },
        board4: {
            id: 'board4',
            title: 'Board Four',
            items: ['item-10'],
        },
        board5: {
            id: 'board5',
            title: 'Board Five',
            items: ['item-13'],
        }
    },
    // array that defines the visual/order of boards
    boardOrder: ['board1', 'board2', 'board3', 'board4', 'board5'],
}


// create a Redux slice named 'boards' with initial state and reducers
const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        /**
         * Reorder items within the same board.
         * Payload: { boardId, oldIndex, newIndex }
         * Uses arrayMove from @dnd-kit/sortable which returns a new array with the element moved.
         */
        // move an item inside the same board from oldIndex -> newIndex
        moveItemWithinBoard: (state, action) => {
            const { boardId, oldIndex, newIndex } = action.payload
            // replace the items array with a new array that has the item moved
            state.boards[boardId].items = arrayMove(
                state.boards[boardId].items,
                oldIndex,
                newIndex
            )
        },

        /**
         * Move an item from one board to another (or append into target board).
         *
         * Payload: { fromBoardId, toBoardId, activeId, newIndex }
         * - fromBoardId: id of the board the item is dragged from
         * - toBoardId: id of the board the item is dropped into
         * - activeId: the id of the dragged item (string)
         * - newIndex: target insertion index in the destination board (optional)
         *
         * Behavior:
         *  - Remove the item from the source board (if present).
         *  - If newIndex is undefined, -1, or >= destination length, push to the end.
         *  - Otherwise insert at newIndex.
         */
        // move an item from one board to another (or append to the end)
        moveItemAcrossBoards: (state, action) => {
            const { fromBoardId, toBoardId, activeId, newIndex } = action.payload

            // defensive: if board ids are invalid, do nothing but log for debugging
            if (!state.boards[fromBoardId] || !state.boards[toBoardId]) {
                console.warn('moveItemAcrossBoards: invalid board id(s)', { fromBoardId, toBoardId, activeId })
                return
            }

            const from = state.boards[fromBoardId].items
            const to = state.boards[toBoardId].items

            const idx = from.indexOf(activeId)
            if (idx !== -1) from.splice(idx, 1)

            if (newIndex === undefined || newIndex === -1 || newIndex >= to.length) {
                to.push(activeId)
            } else {
                to.splice(newIndex, 0, activeId)
            }
        },

        /**
         * Reorder boards themselves.
         *
         * Payload: { oldIndex, newIndex }
         * Uses arrayMove to reorder the boardOrder array.
         */
        // reorder boards themselves by moving a board id in boardOrder
        moveBoard: (state, action) => {
            const { oldIndex, newIndex } = action.payload
            // replace boardOrder with a reordered copy
            state.boardOrder = arrayMove(state.boardOrder, oldIndex, newIndex)
        },


        /**
         * Adds a brand new board object to the main Kanban state.
         * Payload: { id, title, items }
         */
        addKanbanBoard: (state, action) => {
            const newBoard = action.payload;

            // 1. Add to the boards dictionary
            state.boards[newBoard.id] = newBoard;

            // 2. Add to the boardOrder array (at the end)
            state.boardOrder.push(newBoard.id);
        },

        /**
         * Removes an entire board by its ID from the Kanban state. 
         * Payload: { boardId }
         */
        removeKanbanBoard: (state, action) => {
            const boardId = action.payload; // Payload is the board ID (string)

            // 1. Remove the board data object from the dictionary
            //    Immer allows us to use 'delete' on the draft state
            delete state.boards[boardId];

            // 2. Remove the board ID from the ordered array
            //    We create a new array without the matching ID
            state.boardOrder = state.boardOrder.filter(id => id !== boardId);
        },
    },
})
// export the generated action creators and reducer
export const { moveItemWithinBoard, moveItemAcrossBoards, moveBoard, addKanbanBoard, removeKanbanBoard } = boardsSlice.actions
export default boardsSlice.reducer

