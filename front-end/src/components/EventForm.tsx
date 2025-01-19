import React, { useState, useEffect } from 'react';
import './EventForm.css';

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
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Populate form fields with initial event data
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDescription(initialEvent.description || '');
      setStartDate(initialEvent.start?.split('T')[0] || '');
      setStartTime(initialEvent.start?.split('T')[1]?.substr(0, 5) || '');
      setEndDate(initialEvent.end?.split('T')[0] || '');
      setEndTime(initialEvent.end?.split('T')[1]?.substr(0, 5) || '');
    }
  }, [initialEvent]);

  const handleSubmit = () => {
    if (title && startDate && endDate) {
      const start = `${startDate}T${startTime || '00:00'}`;
      const end = `${endDate}T${endTime || '23:59'}`;

      onSubmit({
        id: initialEvent?.id || String(Date.now()),
        title,
        description,
        start, // Use local date-time string directly
        end,   // Use local date-time string directly
        allDay: !startTime && !endTime,
      });
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
        <button onClick={handleSubmit}>
          {initialEvent?.id ? 'Save Changes' : 'Add Event'}
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
