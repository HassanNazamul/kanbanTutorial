// TemplateBoardList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Assuming your thunk file is named 'thunks.js'
import { addTemplateToKanbanAndRemove } from './thunk'; 

// ----------------------------------------------------------------------
// Individual Template Card Component
// ----------------------------------------------------------------------

const TemplateCard = ({ template }) => {
    const dispatch = useDispatch();

    const handleAddClick = () => {
        // Dispatch the thunk, passing the entire template object.
        // The thunk will handle:
        // 1. Copying the board (with new IDs) to the main 'boards' slice.
        // 2. Removing the template from the 'aliasTemplates' slice.
        dispatch(addTemplateToKanbanAndRemove(template));
    };

    return (
        <div 
            style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px', 
                margin: '10px 0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#f9f9f9'
            }}
        >
            <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {template.title}
                </h4>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    Items: {template.items.length}
                </p>
            </div>
            
            {/* The Feature: Add Icon/Button */}
            <button 
                onClick={handleAddClick} 
                title="Add to Kanban Board"
                style={{
                    background: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '30px', 
                    height: '30px', 
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                }}
            >
                ➕
            </button>
        </div>
    );
};

// ----------------------------------------------------------------------
// Main List Component
// ----------------------------------------------------------------------

const TemplateBoardList = () => {
    // Select the list of available templates from the aliasTemplates slice
    // NOTE: You must use the correct slice name (e.g., state.aliasTemplates) 
    // based on how you configured your root store.
    const availableTemplates = useSelector(state => state.aliasTemplates.availableTemplates);
    
    return (
        <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Board Templates (Source)</h2>
            {availableTemplates.length === 0 ? (
                <p style={{ color: '#888' }}>No templates available.</p>
            ) : (
                availableTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                ))
            )}
        </div>
    );
};

export default TemplateBoardList;