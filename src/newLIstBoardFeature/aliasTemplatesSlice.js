// aliasTemplatesSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // List of boards available to be copied into the main Kanban view
    availableTemplates: [
        {
            id: 'template-1',
            title: 'New Project Template',
            items: ["item-20", "item-21"] // Pre-populate with item IDs
        },
        {
            id: 'template-2',
            title: 'Quick To-Do List',
            items: ["item-22"]
        },
        // ... more templates
    ],
}

const aliasTemplatesSlice = createSlice({
    name: 'aliasTemplates',
    initialState,
    reducers: {

        /**
         * Action to add a board back to the template list (reverse operation).
         * Payload: The full board object to reserve.
         */
        addTemplate: (state, action) => {
            const board = action.payload;

            // Check if the board is already in the list to prevent duplicates (optional)
            if (!state.availableTemplates.some(t => t.id === board.id)) {
                // Add the board object to the end of the template list
                state.availableTemplates.push(board);
            }
        },

        /**
         * Action to remove a template from the available list.
         * Payload: The ID of the template board to remove.
         */
        removeTemplate: (state, action) => {
            const templateId = action.payload;
            state.availableTemplates = state.availableTemplates.filter(
                template => template.id !== templateId
            );
        },

    },
})

// Export the new action
export const { removeTemplate, addTemplate } = aliasTemplatesSlice.actions
export default aliasTemplatesSlice.reducer