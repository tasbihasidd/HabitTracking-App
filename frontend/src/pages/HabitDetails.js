import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";

const HabitDetails = ({ habits, categoryIcons }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const habitId = parseInt(id);
  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <div className="section">
        <h2>Habit not found</h2>
        <button className="form-button" onClick={() => navigate("/")}>
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate current month days for calendar view
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div>
      <div className="flex items-center mb-4">
        <button 
          className="form-button secondary mr-4" 
          onClick={() => navigate("/")}
        >
          <FiArrowLeft /> Back
        </button>
        <h1>{habit.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="section">
          <h2 className="section-title">Habit Information</h2>
          <div className="my-4">
            <div className="flex items-center mb-2">
              <div className="mr-2">
                {categoryIcons[habit.category]}
              </div>
              <span className="text-gray-700 font-medium">
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </span>
            </div>
            <p><strong>Frequency:</strong> {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</p>
            <p><strong>Time of Day:</strong> {habit.timeOfDay.charAt(0).toUpperCase() + habit.timeOfDay.slice(1)}</p>
            <p><strong>Started on:</strong> {format(parseISO(habit.startDate), 'MMMM do, yyyy')}</p>
          </div>

          <div className="stats-container flex justify-between mt-6">
            <div className="stat-box bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{habit.streak}</div>
              <div className="text-gray-500">Current Streak</div>
            </div>
            <div className="stat-box bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">{habit.totalCompletions}</div>
              <div className="text-gray-500">Total Completions</div>
            </div>
            <div className="stat-box bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {Math.round((habit.totalCompletions / (new Date() - new Date(habit.startDate))) * 100)}%
              </div>
              <div className="text-gray-500">Consistency</div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title mb-4">
            <FiCalendar className="inline mr-2" />
            Monthly Calendar
          </h2>
          <div className="calendar-grid grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={`header-${i}`} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {Array.from({ length: getDay(monthStart) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8"></div>
            ))}
            
            {daysInMonth.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const isCompleted = habit.completedDates.includes(dateString);
              const isToday = format(new Date(), 'yyyy-MM-dd') === dateString;
              
              return (
                <div 
                  key={dateString}
                  className={`
                    calendar-day h-8 w-8 flex items-center justify-center rounded-full mx-auto 
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isToday && !isCompleted ? 'border-2 border-indigo-500' : ''}
                  `}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="h-3 w-3 rounded-full border border-indigo-500 mr-2"></div>
              <span>Today</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper function to get the day of the week (0-6)
const getDay = (date) => {
  const day = date.getDay();
  return day;
};

export default HabitDetails;