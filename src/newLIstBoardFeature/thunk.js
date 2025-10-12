// thunks.js (or similar file)
import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { addKanbanBoard, removeKanbanBoard } from '../features/boardSlice'; // From the Kanban slice
import { removeTemplate, addTemplate } from './aliasTemplatesSlice'; // From the Template slice

/**
 * Thunk to copy a template board to the Kanban slice AND remove it from the template list.
 * Payload: The original board object from the aliasTemplatesSlice.
 */
export const addTemplateToKanbanAndRemove = createAsyncThunk(
    'aliasTemplates/addToKanbanAndRemove',
    async (templateBoard, { dispatch }) => {

        // --- PREPARE THE NEW BOARD ---

        // 1. Create a deep copy and generate new unique IDs
        const copiedBoard = JSON.parse(JSON.stringify(templateBoard));

        // Use a new ID for the Kanban board instance
        copiedBoard.id = `board-${nanoid()}`;

        // Ensure items also have new unique IDs
        copiedBoard.items = copiedBoard.items.map(() => nanoid());

        // --- TRANSACTION ---

        // 2. Dispatch action to the TARGET SLICE (Kanban/boardsSlice)
        dispatch(addKanbanBoard(copiedBoard));

        // 3. Dispatch action back to the SOURCE SLICE (aliasTemplatesSlice) to remove it
        dispatch(removeTemplate(templateBoard.id));
    }
);


/**
 * Thunk to move a board from the Kanban view (boardsSlice) back to the 
 * template list (aliasTemplatesSlice).
 * * Payload: The ID of the board to be reserved (string).
 */
export const reserveBoardToTemplate = createAsyncThunk(
    'boards/reserveToTemplate',
    async (boardId, { getState, dispatch }) => {
        // getState returns the full root state object
        const state = getState(); 

        // 1. Retrieve the *full board object* before removing it
        // Access state.boards (Kanban slice) and its boards dictionary
        const boardToReserve = state.boards.boards[boardId];

        if (!boardToReserve) {
            console.error(`Board ID ${boardId} not found in Kanban boards.`);
            return;
        }

        // --- TRANSACTION ---

        // 2. Dispatch action to the DESTINATION SLICE (aliasTemplatesSlice)
        // Note: You must ensure 'addTemplate' is imported from aliasTemplatesSlice.js
        dispatch(addTemplate(boardToReserve));

        // 3. Dispatch action to the SOURCE SLICE (boardsSlice)
        // Note: You must ensure 'removeKanbanBoard' is imported from boardsSlice.js
        dispatch(removeKanbanBoard(boardId));
    }
);