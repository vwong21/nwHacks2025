import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useUserContext } from '../UserContext';

import './Calendar.css';
import EventForm from './EventForm';
import EventCard from './EventCard';

interface CalendarProps {
	role: 'student' | 'organizer';
}

const Calendar: React.FC<CalendarProps> = ({ role }) => {
	const { details } = useUserContext();
	const [events, setEvents] = useState<any[]>([]);
	const [editingEvent, setEditingEvent] = useState<any>(null);
	const [selectedEvent, setSelectedEvent] = useState<any>(null);

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/event/${details?.id}`
				);

				// Handle the fetched data, ensuring it's an array
				const eventInfo = response.data.eventInfo;
				const eventsArray = Array.isArray(eventInfo)
					? eventInfo
					: [eventInfo];

				// Format the events to match FullCalendar's requirements
				const formattedEvents = eventsArray.map((event: any) => ({
					id: event.id, // Unique identifier
					title: event.title,
					start: event.start, // Start date/time in ISO format
					end: event.end, // End date/time in ISO format
					extendedProps: {
						location: event.location, // Additional properties if needed
						organizerId: event.organizerId,
					},
				}));

				setEvents(formattedEvents); // Update state
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};

		fetchEventDetails();
	}, [events]);

	// Handle date selection for organizers
	const handleDateSelect = (selectInfo: any) => {
		if (role === 'organizer') {
			const { startStr, endStr } = selectInfo;

			// Adjust the end date to be inclusive
			const adjustedEndDate = new Date(new Date(endStr).getTime() - 1)
				.toISOString()
				.split('T')[0];

			setEditingEvent({
				start: startStr,
				end: adjustedEndDate,
				title: '',
				description: '',
			});
		}
	};

	// Handle event click
	const handleEventClick = (clickInfo: any) => {
		const { event } = clickInfo;

		if (role === 'student') {
			setSelectedEvent({
				title: event.title,
				description: event.extendedProps.description || '',
				start: event.start?.toISOString(), // For display
				end: event.end?.toISOString(), // For display
			});
		} else if (role === 'organizer') {
			setEditingEvent({
				id: event.id,
				title: event.title,
				description: event.extendedProps.description || '',
				start: event.start?.toLocaleString('sv-SE'), // Local date-time string
				end: event.end?.toLocaleString('sv-SE'), // Local date-time string
			});
		}
	};

	// Save or update event
	const saveEvent = (event: any) => {
		if (editingEvent?.id) {
			setEvents((prevEvents) =>
				prevEvents.map((e) =>
					e.id === editingEvent.id ? { ...e, ...event } : e
				)
			);
		} else {
			setEvents([...events, { id: String(Date.now()), ...event }]);
		}
		setEditingEvent(null);
	};

	// Delete event
	const deleteEvent = () => {
		if (editingEvent?.id) {
			setEvents((prevEvents) =>
				prevEvents.filter((e) => e.id !== editingEvent.id)
			);
			return (
				<EventForm
					initialEvent={editingEvent.id}
					onSubmit={saveEvent}
					onDelete={deleteEvent}
					onCancel={() => setEditingEvent(null)}
				/>
			)
		}
		setEditingEvent(null);
	};

	return (
		<div className='calendar-container'>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView='dayGridMonth'
				selectable={role === 'organizer'}
				events={events}
				select={handleDateSelect}
				eventClick={handleEventClick}
				height='auto'
				eventContent={(eventInfo) => (
					// Display only the name of the event
					<div className='custom-event'>{eventInfo.event.title}</div>
				)}
				buttonText={{
					today: 'Today', // Rename the "today" button to "Today"
				}}
			/>

			{/* Event Form for Adding/Editing */}
			{editingEvent && role === 'organizer' && (
				<EventForm
					initialEvent={editingEvent}
					onSubmit={saveEvent}
					onDelete={deleteEvent}
					onCancel={() => setEditingEvent(null)}
				/>
			)}

			{/* Event Card for Students */}
			{selectedEvent && role === 'student' && (
				<EventCard
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</div>
	);
};

export default Calendar;
