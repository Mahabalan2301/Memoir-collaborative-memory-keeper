// CalendarView.js

import React, { useState } from 'react';
import './CalendarView.css'; // Ensure this file is linked

const CalendarView = ({ events }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to enlarge the selected image
  const enlargeImage = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="calendar-view">
      <h2>My Calendar</h2>
      {events.length > 0 ? (
        <div className="calendar-grid">
          {events.map((event, index) => (
            <div key={index} className="calendar-day">
              <div className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>

                {/* Displaying memory image if available */}
                {event.image && (
                  <div className="image-container" onClick={() => enlargeImage(event.image)}>
                    <img src={event.image} alt="Memory" className="event-image" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events to show</p>
      )}

      {/* Enlarge the image if selected */}
      {selectedImage && (
        <div className="image-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged Memory" />
        </div>
      )}
    </div>
  );
};

export default CalendarView;
