// Components/Calendar/Calendar.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
    format, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, addDays,
    getDate, parseISO, isSameMonth
} from 'date-fns';

export default function MyCalendar({ events, onSelectEvent, primaryColor }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    // build weeks of the calendar
    const weeks = [];
    let day = weekStart;
    while (day <= weekEnd) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(day);
            day = addDays(day, 1);
        }
        weeks.push(week);
    }

    const prevMonth = () => setCurrentMonth(addDays(monthStart, -1));     // or subMonths
    const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1));       // or addMonths

    return (
        <Box>
            {/* month header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton onClick={prevMonth}><FaChevronLeft /></IconButton>
                <Typography variant="h6" fontWeight={700}>
                    {format(currentMonth, 'MMMM yyyy')}
                </Typography>
                <IconButton onClick={nextMonth}><FaChevronRight /></IconButton>
            </Box>

            {/* day names */}
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d =>
                    <Typography key={d} variant="subtitle2">{d}</Typography>
                )}
            </Box>

            {/* calendar grid */}
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5}>
                {weeks.map((week, wi) => (
                    <React.Fragment key={wi}>
                        {week.map(date => {
                            const iso = format(date, 'yyyy-MM-dd');
                            const dayNum = getDate(date);
                            const isCurrent = isSameMonth(date, currentMonth);
                            // find any events on this exact date string
                            const dayEvents = events.filter(e => e.date === iso);

                            return (
                                <Box
                                    key={iso}
                                    sx={{
                                        minHeight: '80px',
                                        border: '1px solid #eee',
                                        backgroundColor: isCurrent ? '#fff' : '#f5f5f5',
                                        p: 1,
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ position: 'absolute', top: 2, right: 4, opacity: 0.6 }}
                                    >
                                        {dayNum}
                                    </Typography>

                                    {/* render any events */}
                                    {dayEvents.map(evt => (
                                        <Paper
                                            key={evt.id}
                                            onClick={() => onSelectEvent(evt)}
                                            sx={{
                                                mt: 2,
                                                p: 0.5,
                                                cursor: 'pointer',
                                                backgroundColor: primaryColor,
                                                color: '#fff',
                                                borderRadius: 1,
                                            }}
                                            elevation={1}
                                        >
                                            <Typography variant="caption">{evt.title}</Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
}
