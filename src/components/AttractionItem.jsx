import React, { useState } from "react"
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

    const handleMouseEnter = () => {
        if (!isDragging) {
            setOpen(true)
        }
    }

    const handleMouseLeave = () => {
        if (!isDragging) {
            setOpen(false)
        }
    }

    return (
        <Popover open={open && !isDragging} onOpenChange={(newOpen) => {
            if (!isDragging) {
                setOpen(newOpen)
            }
        }}>
            <PopoverTrigger asChild>
                <div
                    className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        pointerEvents: isDragging ? 'none' : 'auto'
                    }}
                >
                    {/* Left Side */}
                    <div className="flex items-center gap-3">
                        <img
                            src={image}
                            alt={title}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm text-gray-500">{duration}</p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="text-right text-sm">
                        <p className="font-medium">{timeline}</p>
                        <p className="text-gray-500">{timeOfDay}</p>
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