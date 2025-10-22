/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    format,
    addMonths,
    subMonths,
    eachDayOfInterval,
    isSameDay,
    startOfMonth,
    endOfMonth,
    parseISO,
    differenceInCalendarDays,
    addDays,
} from "date-fns";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HorizontalCalendar = forwardRef(
    (
        { selectedDate: selectedDateProp, onSelectedDateChange, setCarouselApi, calendarApi, suppressScrollRef },
        ref
    ) => {
        const selectedDate = selectedDateProp
            ? typeof selectedDateProp === "string"
                ? parseISO(selectedDateProp)
                : selectedDateProp
            : new Date();

        const [dateRange, setDateRange] = useState(() => {
            const start = startOfMonth(subMonths(selectedDate, 6));
            const end = endOfMonth(addMonths(selectedDate, 6));
            return { start, end };
        });

        const days = useMemo(() => {
            return eachDayOfInterval({
                start: dateRange.start,
                end: dateRange.end,
            });
        }, [dateRange]);

        // --- Auto-expand range when user scrolls near edges ---
        useEffect(() => {
            const firstDay = days[0];
            const lastDay = days[days.length - 1];
            const bufferDays = 7; // when within a week, extend range

            if (differenceInCalendarDays(selectedDate, firstDay) < bufferDays) {
                setDateRange((r) => ({
                    start: startOfMonth(subMonths(r.start, 3)),
                    end: r.end,
                }));
            } else if (differenceInCalendarDays(lastDay, selectedDate) < bufferDays) {
                setDateRange((r) => ({
                    start: r.start,
                    end: endOfMonth(addMonths(r.end, 3)),
                }));
            }
        }, [selectedDate, days]);

        // --- Scroll so selectedDate is leftmost ---
        useEffect(() => {
            if (!calendarApi) return;
            if (suppressScrollRef?.current) return;
            const idx = differenceInCalendarDays(selectedDate, days[0]);
            const safeIndex = Math.max(0, Math.min(idx, days.length - 1));

            try {
                calendarApi.scrollTo(safeIndex);
                console.log("Scrolled calendar to index", safeIndex);
            } catch (err) {
                console.warn("calendar scrollTo error", err);
            }
        }, [calendarApi, days, selectedDate]);

        const suppressSelectRef = useRef(false);

        // --- When user scrolls manually, update selectedDate ---
        useEffect(() => {
            if (!calendarApi) return;
            const onSelect = () => {
                if (suppressSelectRef.current) return;
                const snapIdx = calendarApi.selectedScrollSnap();
                const leftMostDate = days[snapIdx];
                if (leftMostDate) {
                    onSelectedDateChange && onSelectedDateChange(leftMostDate.toISOString());
                }
            };
            calendarApi.on("select", onSelect);
            return () => calendarApi.off("select", onSelect);
        }, [calendarApi, days, onSelectedDateChange]);

        // --- Imperative methods ---
        const scrollCalendarToDateWithoutSelecting = useCallback(
            (target) => {
                if (!target) return;
                const targetDate =
                    typeof target === "string" ? parseISO(target) : target;
                if (!calendarApi) return;

                const idx = differenceInCalendarDays(targetDate, days[0]);
                const safeIndex = Math.max(0, Math.min(idx, days.length - 1));
                try {
                    suppressSelectRef.current = true;
                    calendarApi.scrollTo(safeIndex);
                    setTimeout(() => (suppressSelectRef.current = false), 300);
                } catch (err) {
                    console.warn("calendar scroll failed", err);
                }
            },
            [calendarApi, days]
        );

        const scrollCalendarByOffset = useCallback(
            (direction) => {
                if (!calendarApi) return;
                if (direction !== 1 && direction !== -1) return;

                const currentIndex = calendarApi.selectedScrollSnap();
                const newIndex = Math.max(
                    0,
                    Math.min(days.length - 1, currentIndex + direction)
                );

                suppressSelectRef.current = true;
                try {
                    calendarApi.scrollTo(newIndex);
                } catch (err) {
                    console.warn("calendar scrollByOffset failed", err);
                }
                setTimeout(() => (suppressSelectRef.current = false), 300);
            },
            [calendarApi, days.length]
        );

        useImperativeHandle(ref, () => ({
            scrollToDateWithoutSelecting: scrollCalendarToDateWithoutSelecting,
            scrollByOffset: scrollCalendarByOffset,
        }));

        // --- Month navigation ---
        const handlePrevMonth = () => {
            const newSelected = addMonths(selectedDate, -1);
            onSelectedDateChange && onSelectedDateChange(newSelected.toISOString());
        };

        const handleNextMonth = () => {
            const newSelected = addMonths(selectedDate, 1);
            onSelectedDateChange && onSelectedDateChange(newSelected.toISOString());
        };

        const handleDayClick = (date) => {
            onSelectedDateChange && onSelectedDateChange(date.toISOString());
            if (!calendarApi) return;

            const idx = differenceInCalendarDays(date, days[0]);
            const safeIndex = Math.max(0, Math.min(idx, days.length - 1));
            try {
                calendarApi.scrollTo(safeIndex);
            } catch (err) {
                console.warn("calendar scrollTo failed", err);
            }
        };

        return (
            <div className="w-full select-none mb-1">
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
                        {format(selectedDate, "MMMM yyyy")}
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

                <Carousel setApi={setCarouselApi} opts={{ align: "start", loop: false }}>
                    <CarouselContent className="flex px-0">
                        {days.map((date) => {
                            const isSelected = isSameDay(date, selectedDate);
                            return (
                                <CarouselItem key={date.toISOString()} className="basis-auto">
                                    <div
                                        onClick={() => handleDayClick(date)}
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
    }
);

export default HorizontalCalendar;
