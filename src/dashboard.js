import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import CalendarView from './CalendarView'; // Import the CalendarView component if it's a separate file
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; // Import any custom CSS

const API_KEY = 'AIzaSyB9ZOokEfU_SxXo2zLNuTrq3I4P5bGaj1U'; // Replace with your actual Google API Key
const CLIENT_ID = '354605021180-sanmdjscqf31flg0e93j29tmc4ruoshf.apps.googleusercontent.com'; // Replace with your actual Google Client ID
const CALENDAR_ID = 'mahalakshmi.b2022a@vitstudent.ac.in'; // Use 'primary' for the user's main calendar


const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [memoryDate, setMemoryDate] = useState(new Date());
  const [memoryImage, setMemoryImage] = useState(null);

  useEffect(() => {
    if (gapi.client) {
      fetchMemoriesForDate(new Date(), new Date());
    }
  }, []);

  // Fetch events from the Google Calendar API
  const fetchMemoriesForDate = (startDate, endDate) => {
    gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }).then((response) => {
      setEvents(response.result.items);
    }).catch((error) => {
      console.error('Error fetching events:', error);
    });
  };

  // Add a new memory to the Google Calendar
  const addMemoryToCalendar = () => {
    const event = {
      summary: memoryTitle,
      description: memoryText,
      start: { dateTime: new Date(memoryDate), timeZone: 'UTC' },
      end: { dateTime: new Date(memoryDate), timeZone: 'UTC' },
    };

    if (memoryImage) {
      console.log('Image selected:', memoryImage);
      // Image upload logic could be added here if needed
    }

    gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    }).then((response) => {
      console.log('Memory added:', response);
      fetchMemoriesForDate(new Date(), new Date()); // Refresh events after adding
      setMemoryTitle('');
      setMemoryText('');
      setMemoryDate(new Date());
      setMemoryImage(null);
    }).catch((error) => {
      console.error('Error adding memory:', error);
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Main Features Dashboard</h1>

      {/* Date Picker Sidebar */}
      <div className="date-picker-sidebar">
        <h2>Select Date</h2>
        <DatePicker
          selected={memoryDate}
          onChange={(date) => setMemoryDate(date)}
          inline
          calendarClassName="calendar-picker"
        />
      </div>

      {/* Add Memory Form */}
      <div className="add-memory-form">
        <h2>Add a New Memory</h2>
        <input
          type="text"
          placeholder="Memory Title"
          value={memoryTitle}
          onChange={(e) => setMemoryTitle(e.target.value)}
        />
        <textarea
          placeholder="Memory Description"
          value={memoryText}
          onChange={(e) => setMemoryText(e.target.value)}
        />
        <input
          type="datetime-local"
          value={memoryDate}
          onChange={(e) => setMemoryDate(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMemoryImage(e.target.files[0])}
        />
        <button onClick={addMemoryToCalendar}>Add Memory</button>
      </div>

      {/* Display Calendar View */}
      <CalendarView events={events} />
    </div>
  );
};

export default Dashboard;
