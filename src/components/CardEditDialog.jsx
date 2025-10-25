import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import {
    addAttractionToBoard,
    updateBoardHotelName,
    updateAttractionItem,
} from "../features/boardSlice"

export const CardEditDialog = ({ open, onOpenChange, board }) => {

    const dispatch = useDispatch()
    const itemsById = useSelector((s) => s.boards.itemsById)

    // Local dialog state
    const [hotelName, setHotelName] = useState(board.hotelName || "")
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        title: "",
        duration: "",
        timeline: "",
        timeOfDay: "",
        location: "",
        description: "",
    })

    // Sync hotelName whenever dialog opens (so it reflects latest redux)
    useEffect(() => {
        if (open) setHotelName(board.hotelName || "")
    }, [open, board.hotelName])

    const boardItems = useMemo(
        () => board.items.map((id) => itemsById[id]).filter(Boolean),
        [board.items, itemsById]
    )

    // Actions
    const saveHotel = () => {
        dispatch(updateBoardHotelName({ boardId: board.id, hotelName }))
        onOpenChange(false) // close after saving (keep if you prefer staying open)
    }

    const startAddAttraction = () => {
        setSelectedItemId(null)
        setForm({ title: "", duration: "", timeline: "", timeOfDay: "", location: "", description: "" })
        setShowForm(true)
    }

    const saveAttraction = () => {
        if (selectedItemId) {
            dispatch(updateAttractionItem({ itemId: selectedItemId, updatedFields: { ...form } }))
        } else {
            dispatch(addAttractionToBoard({
                boardId: board.id,
                item: { image: "", ...form },
            }))
        }
        // Reset + hide form (compact dialog)
        setSelectedItemId(null)
        setForm({ title: "", duration: "", timeline: "", timeOfDay: "", location: "", description: "" })
        setShowForm(false)
    }

    const cancelForm = () => {
        setSelectedItemId(null)
        setForm({ title: "", duration: "", timeline: "", timeOfDay: "", location: "", description: "" })
        setShowForm(false)
    }

    const handlePickItemToEdit = (itemId) => {
        const item = itemsById[itemId]
        if (!item) return
        setSelectedItemId(itemId)
        setForm({
            title: item.title || "",
            duration: item.duration || "",
            timeline: item.timeline || "",
            timeOfDay: item.timeOfDay || "",
            location: item.location || "",
            description: item.description || "",
        })
        setShowForm(true)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[540px] max-h-[80vh] overflow-y-auto p-4 space-y-4"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <DialogHeader>
                    <DialogTitle>Edit Card</DialogTitle>
                    <DialogDescription>
                        Update the hotel name or manage attractions for this day.
                    </DialogDescription>
                </DialogHeader>

                {/* Hotel Name */}
                <div className="space-y-2">
                    <Label htmlFor="hotelName">Hotel Name</Label>
                    <Input
                        id="hotelName"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="Enter hotel name"
                    />
                </div>

                {/* List + New button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left: list */}
                    <div className="md:col-span-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">Attractions</h4>
                            <Button type="button" variant="outline" size="sm" onClick={startAddAttraction}>
                                <Plus className="mr-1 h-4 w-4" /> New
                            </Button>
                        </div>

                        <div className="rounded-md border divide-y max-h-60 overflow-auto">
                            {boardItems.length === 0 ? (
                                <div className="p-3 text-sm text-gray-500 italic">No attractions yet</div>
                            ) : (
                                boardItems.map((it) => (
                                    <button
                                        key={it.id}
                                        type="button"
                                        className={`w-full text-left p-3 hover:bg-gray-50 ${selectedItemId === it.id ? 'bg-gray-100' : ''}`}
                                        onClick={() => handlePickItemToEdit(it.id)}
                                    >
                                        <div className="font-medium text-sm truncate">{it.title || 'Untitled attraction'}</div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {it.duration || '—'} · {it.timeOfDay || '—'} · {it.location || '—'}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: form — only when New or item selected */}
                    {showForm && (
                        <div className="md:col-span-2 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    {selectedItemId ? "Edit attraction" : "New attraction"}
                                </h4>
                                {selectedItemId && (
                                    <div className="text-xs text-gray-500">Editing: {selectedItemId}</div>
                                )}
                            </div>

                            {[
                                ["title", "Title"],
                                ["duration", "Duration"],
                                ["timeline", "Timeline"],
                                ["timeOfDay", "Time of Day"],
                                ["location", "Location"],
                                ["description", "Description"],
                            ].map(([key, label]) => (
                                <div key={key} className="space-y-1">
                                    <Label htmlFor={key}>{label}</Label>
                                    <Input
                                        id={key}
                                        value={form[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={cancelForm}>Cancel</Button>
                                <Button onClick={saveAttraction}>
                                    {selectedItemId ? "Save Changes" : "Add Attraction"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={saveHotel}>Save Hotel</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
