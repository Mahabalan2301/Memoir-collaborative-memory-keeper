// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebaseConfig';

import CalendarView from './CalendarView';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]); // Store the fetched events
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date());
  const [memoryImage, setMemoryImage] = useState(null);
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('email'); // Retrieve user email

  // Firebase Auth Handling
  const handleSignIn = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsSignedIn(true);
        sessionStorage.setItem('email', result.user.email);
        sessionStorage.setItem('emailstatus', true);
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error signing in:', error.message);
      });
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setIsSignedIn(false);
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('emailstatus');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };

  // Fetch the current auth state from Firebase
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  // Fetch memories from the backend for the signed-in user
  useEffect(() => {
    if (isSignedIn && userEmail) {
      fetch(`http://localhost:5000/api/memories/${userEmail}`)
        .then((response) => response.json())
        .then((data) => {
          setEvents(data); // Store the fetched memories in the state
        })
        .catch((error) => {
          console.error('Error fetching memories:', error);
        });
    }
  }, [isSignedIn, userEmail]);

  // Image to Base64 conversion
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle image and memory data upload
  const addMemoryToCalendar = async () => {
    const base64Image = memoryImage ? await convertToBase64(memoryImage) : null;

    const memoryData = {
      userEmail,
      title: memoryTitle,
      description: memoryText,
      date: memoryDate,
      image: base64Image,
    };

    // Update the fetch URL to point to your backend
    fetch('http://localhost:5000/api/memories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Memory added successfully:', data);
        // Optionally refresh memories after adding
        setEvents((prevEvents) => [...prevEvents, data]);
      })
      .catch(console.error);
  };

  return (
    <div className="app-container">
      <h1 className="head1">Memoir Calendar</h1>
      <div className="auth-container">
        {isSignedIn ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In with Google'}
          </button>
        )}
      </div>

      {isSignedIn ? (
        <div className="content-container">
          <div className="date-picker-sidebar">
            <h2>Select Date</h2>
            <DatePicker
              selected={memoryDate}
              onChange={(date) => setMemoryDate(date)}
              inline
              calendarClassName="calendar-picker"
            />
          </div>
          <div className="add-memory-form">
            <h2>Add a New Memory</h2>
            <input type="text" placeholder="Memory Title" value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} />
            <textarea placeholder="Memory Description" value={memoryText} onChange={(e) => setMemoryText(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setMemoryImage(e.target.files[0])} />
            <button onClick={addMemoryToCalendar}>Add Memory</button>
          </div>
          <CalendarView events={events} />
        </div>
      ) : (
        <p>Please sign in to add and view memories on your calendar.</p>
      )}
    </div>
  );
};

const Dashboard = () => (
  <div>
    <h2>Welcome to the Dashboard</h2>
    {/* Add dashboard content here */}
  </div>
);

export default function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}