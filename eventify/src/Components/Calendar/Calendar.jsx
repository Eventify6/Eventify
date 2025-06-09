// Components/Calendar/Calendar.jsx
import React from 'react';
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

export default function MyCalendar({ events, onSelectEvent, primaryColor }) {
    // style each event’s box
    const eventStyleGetter = (event, start, end, isSelected) => ({
        style: {
            backgroundColor: primaryColor,
            borderRadius: 4,
            border: 'none',
            color: '#fff',
            padding: '2px 4px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    });

    // custom renderer to prepend times
    const Event = ({ event }) => {
        const s = format(event.start, 'HH:mm');
        const e = format(event.end, 'HH:mm');
        return <span>{`${s}-${e} ${event.title}`}</span>;
    };

    // ensure start/end are Date objects
    const normalizedEvents = events.map(evt => ({
        ...evt,
        start: typeof evt.start === 'string' ? new Date(evt.start) : evt.start,
        end: typeof evt.end === 'string' ? new Date(evt.end) : evt.end
    }));

    return (
        <BigCalendar
            localizer={localizer}
            events={normalizedEvents}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            style={{ height: '100%', minHeight: 500 }}
            onSelectEvent={onSelectEvent}
            eventPropGetter={eventStyleGetter}
            components={{ event: Event }}
        />
    );
}
