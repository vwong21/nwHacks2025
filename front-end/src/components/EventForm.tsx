import React, { useState, useEffect } from 'react';
import './EventForm.css';
import axios from 'axios';
import { useUserContext } from '../UserContext';

interface EventFormProps {
  initialEvent: any;
  onSubmit: (event: any) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialEvent,
  onSubmit,
  onDelete,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(''); // New location state
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const {id} = useUserContext();

  // Populate form fields with initial event data
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDescription(initialEvent.description || '');
      setLocation(initialEvent.location || ''); // Populate location if available
      setStartDate(initialEvent.start?.split('T')[0] || '');
      setStartTime(initialEvent.start?.split('T')[1]?.substr(0, 5) || '');
      setEndDate(initialEvent.end?.split('T')[0] || '');
      setEndTime(initialEvent.end?.split('T')[1]?.substr(0, 5) || '');
    }
  }, [initialEvent]);

  const handleSubmit = async () => {
    if (title && startDate && endDate && id) {
      const start = `${startDate}T${startTime || '00:00'}`;
      const end = `${endDate}T${endTime || '23:59'}`;

	  console.log(id);
      try {

        setLoading(true);

        const response = await axios.post('http://localhost:3000/newEvent', {
            title: title,
            location: location,
            start: start,
            end: end,
			organizerId: id
          })
        
          console.log(response.data);
          onSubmit({
            id: initialEvent?.id || String(Date.now()),
            title,
            description,
            location,
            start, // Use local date-time string directly
            end,   // Use local date-time string directly
            allDay: !startTime && !endTime,
          });
      } catch (err) {
        console.error("Error submitting: ",err)
      } finally {
        setLoading(false);
      }

    }
  };

  return (
    <div className="event-form-overlay" onClick={onCancel}>
      <div className="event-form" onClick={(e) => e.stopPropagation()}>
        <h2>{initialEvent?.id ? 'Edit Event' : 'Add Event'}</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Event Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit} disabled={loading}>
          {loading? 'Submitting...' : initialEvent?.id ? 'Save Changes' : 'Add Event'}
        </button>
        {initialEvent?.id && onDelete && (
          <button className="delete-button" onClick={onDelete}>
            Delete Event
          </button>
        )}
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EventForm;
