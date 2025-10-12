import React, { useState, useRef, useEffect } from 'react';
import './HorizontalCalendar.css';
// You might use a library like 'date-fns' or 'moment' for date operations
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const HorizontalCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const calendarRef = useRef(null);

    // --- Date Generation Logic ---
    // Generate a range of dates to display (e.g., 60 days around the current date)
    const today = new Date();
    const startDate = addDays(today, -30);
    const endDate = addDays(today, 30);
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    // --- Auto-Scroll Logic ---
    // Centers the selected date element when the component loads or selectedDate changes
    useEffect(() => {
        if (calendarRef.current) {
            const selectedElement = calendarRef.current.querySelector('.date-item.selected');
            if (selectedElement) {
                // Scroll the container so the selected element is in the middle
                const offset = selectedElement.offsetLeft - (calendarRef.current.offsetWidth / 2) + (selectedElement.offsetWidth / 2);
                calendarRef.current.scroll({ left: offset, behavior: 'smooth' });
            }
        }
    }, [selectedDate]);

    // --- Rendering ---
    return (
        <div className="horizontal-calendar-container">
            <div className="calendar-header">
                <h2>{format(selectedDate, 'MMMM yyyy')}</h2>
            </div>

            <div className="calendar-reel" ref={calendarRef}>
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <div
                            key={date.toISOString()}
                            className={`date-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <div className="day-name">{format(date, 'EE')}</div>
                            <div className="day-number">{format(date, 'd')}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalCalendar;