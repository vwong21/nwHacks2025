import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './globals.css';

import Calendar from './components/Calendar';

const App: React.FC = () => {
  // Role state: either "student" or "organizer"
  const [role, setRole] = useState<'student' | 'organizer'>('student');

  return (
    <div>
      <Navbar />
      {/* Role Switcher for Demo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: role === 'student' ? '#007bff' : '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => setRole('student')}
        >
          Student
        </button>
        <button
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: role === 'organizer' ? '#007bff' : '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => setRole('organizer')}
        >
          Organizer
        </button>
      </div>

      {/* Calendar Component with Role */}
      <div style={{ padding: '20px', marginTop: '2rem' }}>
        <Calendar role={role} />
      </div>
    </div>
  );
};

export default App;
