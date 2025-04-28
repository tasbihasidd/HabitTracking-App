import React, { useState } from "react";
import { FiTarget, FiPlus, FiCalendar, FiCheck } from "react-icons/fi";
import { format } from "date-fns";

const Goals = ({ goals, addGoal, updateGoalProgress, toggleMilestone, categoryIcons }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "fitness",
    targetDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 days from now
    milestones: [
      { id: 1, name: "First milestone", completed: false }
    ]
  });
  const [newMilestone, setNewMilestone] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value,
    });
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim() === "") return;
    
    const newId = newGoal.milestones.length ? 
      Math.max(...newGoal.milestones.map(m => m.id)) + 1 : 1;
      
    setNewGoal({
      ...newGoal,
      milestones: [
        ...newGoal.milestones,
        { id: newId, name: newMilestone, completed: false }
      ]
    });
    
    setNewMilestone("");
  };

  const handleRemoveMilestone = (id) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter(m => m.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal({
      name: "",
      category: "fitness",
      targetDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      milestones: [
        { id: 1, name: "First milestone", completed: false }
      ]
    });
    setShowAddForm(false);
  };

  const handleProgressChange = (goalId, newValue) => {
    updateGoalProgress(goalId, parseInt(newValue));
  };

  return (
    <div className="goals-page">
      <div className="page-header flex justify-between items-center mb-6">
        <h1>Goals & Milestones</h1>
        <button 
          className="form-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus size={18} /> New Goal
        </button>
      </div>

      {showAddForm && (
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Goal Name</label>
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              value={newGoal.name}
              onChange={handleInputChange}
              placeholder="E.g., Run a marathon"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={newGoal.category}
              onChange={handleInputChange}
            >
              <option value="fitness">Fitness & Health</option>
              <option value="learning">Learning & Education</option>
              <option value="mindfulness">Mindfulness & Well-being</option>
              <option value="productivity">Productivity & Work</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="targetDate">Target Date</label>
            <input
              className="form-input"
              type="date"
              id="targetDate"
              name="targetDate"
              value={newGoal.targetDate}
              onChange={handleInputChange}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Milestones</label>
            <div className="milestones-list">
              {newGoal.milestones.map(milestone => (
                <div key={milestone.id} className="milestone-item flex justify-between items-center mb-2">
                  <span>{milestone.name}</span>
                  <button 
                    type="button" 
                    className="text-red-500"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="add-milestone-form flex mt-2">
              <input
                className="form-input flex-1 mr-2"
                type="text"
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="New milestone"
              />
              <button 
                type="button" 
                className="form-button"
                onClick={handleAddMilestone}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button">Create Goal</button>
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

      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-state section">
            <p>You don't have any goals yet. Start by creating one!</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <h3 className="goal-title">{goal.name}</h3>
                <div className="goal-category">
                  {categoryIcons[goal.category]}
                  <span>{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <FiCalendar className="mr-1" />
                <span>Target: {goal.targetDate}</span>
              </div>
              
              <div className="progress-container">
                <label htmlFor={`progress-${goal.id}`} className="text-sm text-gray-600">Progress: {goal.progress}%</label>
                <input
                  type="range"
                  id={`progress-${goal.id}`}
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleProgressChange(goal.id, e.target.value)}
                  className="w-full mt-1"
                />
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
              
              <div className="milestones">
                <h4 className="font-medium text-gray-700 mt-4 mb-2">Milestones</h4>
                {goal.milestones.map(milestone => (
                  <div key={milestone.id} className="milestone-item">
                    <div 
                      className={`milestone-checkbox ${milestone.completed ? 'checked' : ''}`}
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      {milestone.completed && <FiCheck size={14} />}
                    </div>
                    <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Goals;