// TemplateBoardList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTemplateToKanbanAndRemove } from './thunk';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // Adjust path if needed
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { Plus } from 'lucide-react'; // For the button icon

// ----------------------------------------------------------------------
// Individual Template Card Component (Refactored)
// ----------------------------------------------------------------------

const TemplateCard = ({ template }) => {
    const dispatch = useDispatch();

    // to your items object in the Redux store.
    const allItems = useSelector(state => state.aliasTemplates.items);

    const handleAddClick = () => {
        dispatch(addTemplateToKanbanAndRemove(template));
    };

    return (
        <Card className="w-45 overflow-hidden gap-1 rounded-2xl shadow-lg p-2 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
            {/* --- HEADER SECTION (With Drag Handle and Button) --- */}
            <CardHeader className="flex justify-between px-3">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddClick}
                    title="Add to Kanban Board"
                    className="h-8 w-8"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-0">
                <div className="flex flex-col space-y-2">
                    {template.items.map(itemId => {
                        const item = allItems ? allItems[itemId] : null;

                        if (!item) {
                            return (
                                <div
                                    key={itemId}
                                    className="px-3 py-2 text-sm text-muted-foreground italic"
                                >
                                    (Item ID: {itemId})
                                </div>
                            );
                        }

                    })}
                </div>
            </CardContent>
        </Card>
    );
};

// ----------------------------------------------------------------------
// Main List Component (Refactored)
// ----------------------------------------------------------------------

const TemplateBoardList = () => {
    const availableTemplates = useSelector(state => state.aliasTemplates.availableTemplates);

    return (
        // ⬇️ CHANGED: Removed 'mx-auto max-w-sm' and made it 'w-full'
        <div className="w-full rounded-lg bg-white p-5 shadow-md dark:bg-zinc-900">
            <h2 className="text-xl font-bold">Board Templates</h2>
            <p className="mb-2 text-sm text-muted-foreground">(Source)</p>

            {availableTemplates.length === 0 ? (
                <p className="text-muted-foreground">No templates available.</p>
            ) : (
                // ⬇️ ADDED: Wrapper div for flex-wrap layout
                <div className="flex flex-wrap gap-4">
                    {availableTemplates.map(template => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplateBoardList;