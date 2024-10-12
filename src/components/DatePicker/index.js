import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react'; // Đổi tên icon để tránh xung đột
import './DatePicker.css';

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState('Select day');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date.toDateString());
    setIsCalendarVisible(false);
  };

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  return (
    <div className="date-picker">
      <input
        type="text"
        value={selectedDate}
        readOnly
        className="date-input"
        onClick={toggleCalendar}
      />
      <CalendarIcon className="calendar-icon" />
      {isCalendarVisible && (
        <div className="calendar">
          <CalendarComponent
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onChangeMonth={changeMonth}
          />
        </div>
      )}
    </div>
  );
}

// Component Calendar
function CalendarComponent({ currentDate, onDateChange, onChangeMonth }) {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return (
    <div>
      <div className="calendar-header">
        <button onClick={() => onChangeMonth(-1)}>&lt;</button>
        <span>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</span>
        <button onClick={() => onChangeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }, (_, i) => (
          <div
            key={i + 1}
            className="calendar-day"
            onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatePicker;
