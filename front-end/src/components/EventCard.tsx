import React from 'react';
import './EventCard.css';

interface EventCardProps {
  event: {
    title: string;
    description: string;
    start: string;
    end: string;
  };
  onClose: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClose }) => {
  return (
    <div className="event-card-overlay" onClick={onClose}>
      <div className="event-card" onClick={(e) => e.stopPropagation()}>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Start:</strong> {new Date(event.start).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(event.end).toLocaleString()}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventCard;
