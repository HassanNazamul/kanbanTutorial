
import React, { useState } from "react";
import { format, addDays, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addMonths } from "date-fns";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"; // from shadcn/ui
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // optional helper if using shadcn setup

const HorizontalCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());


    // Generate all days of the current month dynamically
    const monthDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Handlers for changing months
    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = addMonths(prev, -1);
            setSelectedDate(startOfMonth(newMonth));
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = addMonths(prev, 1);
            setSelectedDate(startOfMonth(newMonth)); 
            return newMonth;
        });
    };

    return (
        <div className="w-full select-none mb-1">
            {/* Header with Month & Navigation */}
            <div className="flex items-center justify-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className="hover:bg-gray-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <h2 className="text-md text-center w-30 font-semibold">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className="hover:bg-gray-100"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Horizontal Calendar Carousel */}
            <Carousel opts={{ align: "start", loop: false }}>
                <CarouselContent className="flex px-0">
                    {monthDays.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <CarouselItem key={date.toISOString()} className="basis-auto">
                                <div
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "flex items-center justify-center gap-2 w-[180px] h-8 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                        isSelected
                                            ? "bg-blue-600 text-white border-blue-800 shadow-md"
                                            : "bg-gray-100 hover:bg-gray-200 border-transparent"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "text-xs uppercase",
                                            isSelected ? "text-blue-100" : "text-gray-500"
                                        )}
                                    >
                                        {format(date, "EE")}
                                    </div>
                                    <div className="text-lg font-bold">{format(date, "d")}</div>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default HorizontalCalendar;
