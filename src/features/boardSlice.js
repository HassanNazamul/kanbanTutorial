// import Redux Toolkit helper to create a slice with reducers and actions
import { createSlice, nanoid } from '@reduxjs/toolkit'
// import arrayMove utility to reorder arrays immutably
import { arrayMove } from '@dnd-kit/sortable'
import { addDays, formatISO, parseISO } from 'date-fns'


const baseDate = new Date() // default base

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
            hotelName: 'Sample Hotel',
            date: formatISO(baseDate),
            items: ['item-1'],
        },
        board2: {
            id: 'board2',
            title: 'Board Two',
            hotelName: 'Sample Hotel',
            date: formatISO(addDays(baseDate, 1)),
            items: ['item-4'],
        },
        board3: {
            id: 'board3',
            title: 'Board Three',
            hotelName: 'Sample Hotel',
            date: formatISO(addDays(baseDate, 2)),
            items: ['item-7'],
        },
        board4: {
            id: 'board4',
            title: 'Board Four',
            hotelName: 'Sample Hotel',
            date: formatISO(addDays(baseDate, 3)),
            items: ['item-10'],
        },
        board5: {
            id: 'board5',
            title: 'Board Five',
            hotelName: 'Sample Hotel',
            date: formatISO(addDays(baseDate, 4)),
            items: ['item-13'],
        },
        board6: {
            id: 'board6',
            title: 'Board Six',
            hotelName: 'Sample Hotel',
            date: formatISO(addDays(baseDate, 5)),
            items: ['item-16'],
        },

    },
    // array that defines the visual/order of boards
    boardOrder: ['board1', 'board2', 'board3', 'board4', 'board5', 'board6'],

    itemsById: {
        'item-1': { id: 'item-1', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 1', duration: '2 hours', timeline: '2 hours', timeOfDay: 'Morning', location: 'Old Town, Rome', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
        'item-4': { id: 'item-4', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 4', duration: '3 hours', timeline: '2 hours', timeOfDay: 'Afternoon', location: 'Paris, France', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
        'item-7': { id: 'item-7', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 7', duration: '4 hours', timeline: '2 hours', timeOfDay: 'Morning', location: 'Dubai, UAE', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
        'item-10': { id: 'item-10', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 10', duration: '1.5 hours', timeline: '2 hours', timeOfDay: 'Morning', location: 'Tornoto, Canada', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
        'item-13': { id: 'item-13', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 13', duration: '1 hours', timeline: '2 hours', timeOfDay: 'Afternoon', location: 'Mississauga, Canada', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
        'item-16': { id: 'item-16', image: 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg', title: 'Sample 16', duration: '3 hours', timeline: '2 hours', timeOfDay: 'Evening', location: 'Texas, USA', description: "Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire." },
    },
}


// create a Redux slice named 'boards' with initial state and reducers
const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {

        /**
         * Set every board's date such that board at boardOrder[i] receives baseDate + i days
         * Payload: { baseDateISO: string }   // ISO string representation
         */
        setBoardDatesFromBase: (state, action) => {
            const baseDateISO = action.payload
            // iterate through boardOrder and set date for each board
            for (let i = 0; i < state.boardOrder.length; i++) {
                const boardId = state.boardOrder[i]
                // compute date for this board: baseDate + i
                // We store the string; parent will format for display
                const d = new Date(baseDateISO)
                d.setDate(d.getDate() + i)
                state.boards[boardId].date = d.toISOString()
            }
        },

        /**
     * Optionally, an action to update a single board's date directly:
     * Payload: { boardId, dateISO }
     */
        setBoardDate: (state, action) => {
            const { boardId, dateISO } = action.payload
            if (state.boards[boardId]) {
                state.boards[boardId].date = dateISO
            }
        },


        /**
         * Adds a new empty board to the state with a unique id.
         * The new board has no items and a default title.
         */

        addEmptyBoard: (state) => {
            const newId = `board-${Date.now()}`
            const boardOrder = state.boardOrder
            const boards = state.boards

            // Default date = today if no boards exist
            let newDate = new Date().toISOString()

            if (boardOrder.length > 0) {
                const lastBoardId = boardOrder[boardOrder.length - 1]
                const lastBoard = boards[lastBoardId]

                if (lastBoard && lastBoard.date) {
                    // Parse and add 1 day
                    const nextDay = addDays(parseISO(lastBoard.date), 1)
                    newDate = nextDay.toISOString()
                }
            }

            const newBoard = {
                id: newId,
                items: [],
                date: newDate,
                title: `Day ${boardOrder.length + 1}`,
            }

            // Add to state
            state.boards[newId] = newBoard
            state.boardOrder.push(newId)
        },


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

            // 1) Snapshot current order and the dates at each position
            const oldOrder = state.boardOrder.slice()
            const datesByPos = oldOrder.map((id) => state.boards[id]?.date ?? null)

            // 2) Compute the new order (cards moved, positions stay)
            const newOrder = arrayMove(oldOrder, oldIndex, newIndex)

            // 3) Commit the new order
            state.boardOrder = newOrder

            // 4) Reassign dates so that positions keep their original dates
            //    i.e., date at position i is given to the board now at position i
            for (let i = 0; i < newOrder.length; i++) {
                const boardId = newOrder[i]
                const dateForThisPosition = datesByPos[i]
                if (boardId && dateForThisPosition != null && state.boards[boardId]) {
                    state.boards[boardId].date = dateForThisPosition
                }
            }

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
            const boardId = action.payload; // string

            // Find index BEFORE mutating order
            const removedIndex = state.boardOrder.indexOf(boardId);
            if (removedIndex === -1) return; // not found; nothing to do

            // 1) Remove the board data
            delete state.boards[boardId];

            // 2) Compute the new order (without the removed board)
            const newOrder = state.boardOrder.filter(id => id !== boardId);

            // 3) Shift dates back by 1 day for all boards that were AFTER the removed one
            for (let i = removedIndex; i < newOrder.length; i++) {
                const id = newOrder[i];
                const b = state.boards[id];
                if (b?.date) {
                    b.date = addDays(parseISO(b.date), -1).toISOString();
                }
            }

            // 4) Commit new order
            state.boardOrder = newOrder;
        },

        updateBoardHotelName: (state, action) => {
            const { boardId, hotelName } = action.payload
            if (state.boards[boardId]) {
                state.boards[boardId].hotelName = hotelName
            }
        },

        addAttractionToBoard: (state, action) => {
            const { boardId, item } = action.payload
            const board = state.boards[boardId]
            if (!board) return
            const id = nanoid()
            state.itemsById[id] = {
                id,
                image: item.image || 'https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg',
                title: item.title || '',
                duration: item.duration || '',
                timeline: item.timeline || '',
                timeOfDay: item.timeOfDay || '',
                location: item.location || '',
                description: item.description || '',
            }
            board.items.push(id)
        },

        updateAttractionItem: (state, action) => {
            const { itemId, updatedFields } = action.payload
            if (state.itemsById[itemId]) {
                state.itemsById[itemId] = {
                    ...state.itemsById[itemId],
                    ...updatedFields
                }
            }
        },
    },
})
// export the generated action creators and reducer
export const { moveItemWithinBoard, moveItemAcrossBoards, moveBoard, addKanbanBoard, removeKanbanBoard, setBoardDatesFromBase,
    setBoardDate, addEmptyBoard, updateBoardHotelName, addAttractionToBoard, updateAttractionItem } = boardsSlice.actions
export default boardsSlice.reducer

