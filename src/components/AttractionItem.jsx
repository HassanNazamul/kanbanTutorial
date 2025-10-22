import React, { useState, useRef } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export const AttractionItem = ({
    image,
    title,
    duration,
    timeline,
    timeOfDay,
    location,
    description,
    isDragging = false
}) => {
    const [open, setOpen] = useState(false)
    const hoverTimeoutRef = useRef(null)

    const handleMouseEnter = () => {
        if (!isDragging) {
            hoverTimeoutRef.current = setTimeout(() => {
                setOpen(true)
            }, 500)
        }
    }

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setOpen(false)

    }

    return (
        <Popover open={open && !isDragging} onOpenChange={(newOpen) => {
            if (!isDragging) {
                setOpen(newOpen)
            }
        }}>
            <PopoverTrigger asChild>
                <div
                    className="grid grid-cols-12 items-center gap-2 p-1 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        pointerEvents: isDragging ? 'none' : 'auto'
                    }}
                >
                    {/* Column 1: Image (spans 3 of 12 columns) */}
                    <div className="col-span-4">
                        <img
                            src={image}
                            alt={title}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>

                    {/* Column 2: Text Content (spans 9 of 12 columns) */}
                    <div className="col-span-8 min-w-0">
                        <p className="font-medium text-sm truncate text-right">{title}</p>
                        <p className="text-xs text-gray-500 text-right">{duration}</p>
                    </div>
                </div>
            </PopoverTrigger>

            <PopoverContent
                side="right"
                align="center"
                className="w-72 p-3 space-y-3 shadow-xl"
            >
                <div className="flex flex-col gap-2">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-32 rounded-lg object-cover"
                    />
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-gray-500">{location}</p>
                    </div>
                    <p className="text-sm text-gray-700">{description}</p>

                    <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                        <p>Duration: {duration}</p>
                        <p>{timeOfDay}</p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}