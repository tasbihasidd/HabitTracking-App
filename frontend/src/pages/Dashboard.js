import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiPlus, FiCheck, FiX, FiTrendingUp, FiAward } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ 
  habits, 
  goals, 
  achievements, 
  toggleHabitCompletion, 
  addHabit, 
  currentDate,
  categoryIcons 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "fitness",
    frequency: "daily",
    timeOfDay: "morning",
    color: "#4F46E5",
    startDate: format(new Date(), 'yyyy-MM-dd')
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDisplayFormat = format(new Date(), 'EEEE, MMMM do, yyyy');

  // Stats for charts
  const categoryStats = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {});

  const completionStats = habits.reduce((acc, habit) => {
    const isCompleted = habit.completedDates.includes(today);
    acc.completed = isCompleted ? acc.completed + 1 : acc.completed;
    acc.total += 1;
    return acc;
  }, { completed: 0, total: 0 });

  // Chart data
  const categoryChartData = {
    labels: Object.keys(categoryStats).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: Object.values(categoryStats),
        backgroundColor: [
          '#4F46E5',
          '#059669',
          '#DC2626',
          '#F59E0B',
        ],
        borderWidth: 1,
      },
    ],
  };

  const streakChartData = {
    labels: habits.map(habit => habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name),
    datasets: [
      {
        label: 'Current Streak',
        data: habits.map(habit => habit.streak),
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        borderWidth: 1,
      },
    ],
  };

  const streakChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Current Streaks'
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit({
      ...newHabit,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(newHabit);
    setNewHabit({
      name: "",
      category: "fitness",
      frequency: "daily",
      timeOfDay: "morning",
      color: "#4F46E5",
      startDate: format(new Date(), 'yyyy-MM-dd')
    });
    setShowAddForm(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-display">{todayDisplayFormat}</div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Today's Habits</h2>
          <button 
            className="form-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FiPlus size={18} /> Add Habit
          </button>
        </div>

        {showAddForm && (
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Habit Name</label>
              <input
                className="form-input"
                type="text"
                id="name"
                name="name"
                value={newHabit.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={newHabit.category}
                onChange={handleInputChange}
              >
                <option value="fitness">Fitness & Health</option>
                <option value="learning">Learning & Education</option>
                <option value="mindfulness">Mindfulness & Well-being</option>
                <option value="productivity">Productivity & Work</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timeOfDay">Time of Day</label>
              <select
                className="form-select"
                id="timeOfDay"
                name="timeOfDay"
                value={newHabit.timeOfDay}
                onChange={handleInputChange}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={newHabit.color}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="form-button">Add Habit</button>
              <button 
                type="button" 
                className="form-button secondary ml-2"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {habits.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any habits yet. Start by adding one!</p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                className="habit-card"
                style={{ borderTopColor: habit.color }}
              >
                <div className="habit-header">
                  <div>
                    <h3 className="habit-name">{habit.name}</h3>
                    <div className="habit-category">
                      {categoryIcons[habit.category]}
                      <span>{habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}</span>
                    </div>
                  </div>
                  <button 
                    className={`complete-button ${habit.completedDates.includes(today) ? 'completed' : ''}`}
                    onClick={() => toggleHabitCompletion(habit.id)}
                  >
                    {habit.completedDates.includes(today) ? (
                      <FiCheck size={18} />
                    ) : (
                      <FiX size={18} />
                    )}
                  </button>
                </div>
                <div className="habit-stats">
                  <div className="stat">
                    <span className="stat-value">{habit.streak}</span>
                    <span className="stat-label">Streak</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{habit.totalCompletions}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <Link to={`/habit/${habit.id}`} className="form-button secondary ml-auto">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-charts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="section">
            <h2 className="section-title">Habits by Category</h2>
            <div className="chart-container" style={{ height: '200px', position: 'relative' }}>
              <Doughnut data={categoryChartData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="completion-status mt-4">
              <p>Today's Progress: {completionStats.completed} of {completionStats.total} habits completed</p>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Current Streaks</h2>
            <div className="chart-container" style={{ height: '200px', position: 'relative' }}>
              <Bar data={streakChartData} options={streakChartOptions} />
            </div>
          </section>
        </div>
      </div>

      <div className="dashboard-summaries">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Goals In Progress</h2>
              <Link to="/goals" className="form-button secondary">
                <FiTrendingUp size={16} /> View All
              </Link>
            </div>
            {goals.length === 0 ? (
              <p>No goals set yet.</p>
            ) : (
              <div className="goals-summary">
                {goals.slice(0, 2).map(goal => (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-header">
                      <h3 className="goal-title">{goal.name}</h3>
                      <div className="goal-category">
                        {categoryIcons[goal.category]}
                        <span>{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <div className="progress-text">{goal.progress}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Recent Achievements</h2>
              <Link to="/achievements" className="form-button secondary">
                <FiAward size={16} /> View All
              </Link>
            </div>
            {achievements.filter(a => a.isUnlocked).length === 0 ? (
              <p>No achievements unlocked yet.</p>
            ) : (
              <div className="achievements-summary">
                {achievements.filter(a => a.isUnlocked).slice(0, 2).map(achievement => (
                  <div key={achievement.id} className="achievement-card">
                    <div className="achievement-icon">
                      🏆
                    </div>
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    {achievement.unlockedDate && (
                      <div className="achievement-date">
                        Unlocked on {achievement.unlockedDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;