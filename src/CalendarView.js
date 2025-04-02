import React, { useState } from "react";
import "./CalendarView.css";

const CalendarView = ({ events }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Function to enlarge the selected image and display title & description
  const enlargeImage = (event) => {
    setSelectedImage(event.image);
    setSelectedTitle(event.title);
    setSelectedDescription(event.description);
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );
  };

  // Handle navigation between months
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  // Generate calendar for the current month
  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const eventsForDate = getEventsForDate(date);

      days.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>
          <div className="events">
            {eventsForDate.map((event, index) => (
              <div
                key={index}
                className="event-circle"
                onClick={() => enlargeImage(event)}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt="Memory"
                    className="event-image-circle"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-view">
      <h2>My Calendar</h2>
      <div className="calendar-navigation">
        <button onClick={handlePreviousMonth}>Previous</button>
        <span>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="calendar-grid">{renderCalendar()}</div>

      {/* Enlarge the image with memory title and description if selected */}
      {selectedImage && (
        <div className="image-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-overlay-content">
            <div className="memory-details">
              <h3>{selectedTitle}</h3>
              <p>{selectedDescription}</p>
            </div>
            <img
              src={selectedImage}
              alt="Enlarged Memory"
              className="enlarged-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;



