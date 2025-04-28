import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { format } from "date-fns";

// Icons
import { FiHome, FiTrendingUp, FiAward, FiSettings, FiTarget, FiPlus, FiCheck, FiX } from "react-icons/fi";
import { FaDumbbell, FaBook, FaBrain, FaLaptopCode } from "react-icons/fa";

// Components
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import HabitDetails from "./pages/HabitDetails";
import Goals from "./pages/Goals";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";

function App() {
  // Sample initial habits data
  const initialHabits = [
    {
      id: 1,
      name: "Morning workout",
      category: "fitness",
      frequency: "daily",
      timeOfDay: "morning",
      streak: 5,
      totalCompletions: 12,
      startDate: "2025-03-01",
      completedDates: [
        "2025-03-21", "2025-03-22", "2025-03-23", "2025-03-24", "2025-03-25"
      ],
      color: "#4F46E5"
    },
    {
      id: 2,
      name: "Read 30 minutes",
      category: "learning",
      frequency: "daily",
      timeOfDay: "evening",
      streak: 3,
      totalCompletions: 8,
      startDate: "2025-03-05",
      completedDates: [
        "2025-03-23", "2025-03-24", "2025-03-25"
      ],
      color: "#059669"
    },
    {
      id: 3,
      name: "Meditate",
      category: "mindfulness",
      frequency: "daily",
      timeOfDay: "morning",
      streak: 0,
      totalCompletions: 5,
      startDate: "2025-03-10",
      completedDates: [],
      color: "#DC2626"
    },
    {
      id: 4,
      name: "Code practice",
      category: "productivity",
      frequency: "daily",
      timeOfDay: "afternoon",
      streak: 1,
      totalCompletions: 10,
      startDate: "2025-03-03",
      completedDates: [
        "2025-03-25"
      ],
      color: "#F59E0B"
    }
  ];

  // Goals sample data
  const initialGoals = [
    {
      id: 1,
      name: "Exercise 4x per week",
      category: "fitness",
      progress: 75,
      targetDate: "2025-04-30",
      milestones: [
        { id: 1, name: "First week complete", completed: true },
        { id: 2, name: "Two weeks consistent", completed: true },
        { id: 3, name: "One month streak", completed: false }
      ]
    },
    {
      id: 2,
      name: "Read 10 books this year",
      category: "learning",
      progress: 30,
      targetDate: "2025-12-31",
      milestones: [
        { id: 1, name: "First 3 books", completed: true },
        { id: 2, name: "Halfway point", completed: false },
        { id: 3, name: "Complete goal", completed: false }
      ]
    }
  ];

  // Achievements sample data
  const initialAchievements = [
    {
      id: 1,
      name: "Early Bird",
      description: "Complete morning habits for 5 consecutive days",
      isUnlocked: true,
      unlockedDate: "2025-03-20",
      icon: "FiSunrise"
    },
    {
      id: 2,
      name: "Bookworm",
      description: "Complete reading habit 10 times",
      isUnlocked: false,
      unlockedDate: null,
      icon: "FiBook"
    },
    {
      id: 3,
      name: "Zen Master",
      description: "Meditate for 15 consecutive days",
      isUnlocked: false,
      unlockedDate: null,
      icon: "FiFeather"
    }
  ];

  // App state
  const [habits, setHabits] = useState(initialHabits);
  const [goals, setGoals] = useState(initialGoals);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [currentDate] = useState(new Date());

  // Category icons mapping
  const categoryIcons = {
    fitness: <FaDumbbell />,
    learning: <FaBook />,
    mindfulness: <FaBrain />,
    productivity: <FaLaptopCode />
  };

  // Toggle habit completion status for today
  const toggleHabitCompletion = (habitId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(today);
          
          let newCompletedDates;
          let newStreak;
          let newTotalCompletions;
          
          if (isCompleted) {
            // Uncomplete the habit
            newCompletedDates = habit.completedDates.filter(date => date !== today);
            newStreak = Math.max(0, habit.streak - 1);
            newTotalCompletions = Math.max(0, habit.totalCompletions - 1);
          } else {
            // Complete the habit
            newCompletedDates = [...habit.completedDates, today];
            newStreak = habit.streak + 1;
            newTotalCompletions = habit.totalCompletions + 1;
          }
          
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak,
            totalCompletions: newTotalCompletions
          };
        }
        return habit;
      })
    );
  };

  // Add a new habit
  const addHabit = (newHabit) => {
    const id = habits.length ? Math.max(...habits.map(h => h.id)) + 1 : 1;
    setHabits([...habits, { ...newHabit, id, streak: 0, totalCompletions: 0, completedDates: [] }]);
  };

  // Add a new goal
  const addGoal = (newGoal) => {
    const id = goals.length ? Math.max(...goals.map(g => g.id)) + 1 : 1;
    setGoals([...goals, { ...newGoal, id, progress: 0, milestones: [] }]);
  };

  // Update goal progress
  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, progress: newProgress } : goal
      )
    );
  };

  // Toggle milestone completion
  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone => 
            milestone.id === milestoneId ? 
              { ...milestone, completed: !milestone.completed } : 
              milestone
          );
          return { ...goal, milestones: updatedMilestones };
        }
        return goal;
      })
    );
  };

  // Check for new achievements
  useEffect(() => {
    // For demonstration, we'd implement more complex achievement logic here
    // This is just a placeholder to show how it would work
    const checkEarlyBirdAchievement = () => {
      const morningHabits = habits.filter(habit => habit.timeOfDay === "morning");
      const hasConsecutiveDays = morningHabits.some(habit => habit.streak >= 5);
      
      if (hasConsecutiveDays) {
        setAchievements(prevAchievements => 
          prevAchievements.map(achievement => 
            achievement.id === 1 && !achievement.isUnlocked ? 
              { ...achievement, isUnlocked: true, unlockedDate: format(new Date(), 'yyyy-MM-dd') } : 
              achievement
          )
        );
      }
    };
    
    const checkBookwormAchievement = () => {
      const readingHabit = habits.find(habit => habit.name.toLowerCase().includes("read"));
      if (readingHabit && readingHabit.totalCompletions >= 10) {
        setAchievements(prevAchievements => 
          prevAchievements.map(achievement => 
            achievement.id === 2 && !achievement.isUnlocked ? 
              { ...achievement, isUnlocked: true, unlockedDate: format(new Date(), 'yyyy-MM-dd') } : 
              achievement
          )
        );
      }
    };
    
    checkEarlyBirdAchievement();
    checkBookwormAchievement();
  }, [habits]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar 
          categoryIcons={categoryIcons}
        />
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    habits={habits} 
                    goals={goals}
                    achievements={achievements}
                    toggleHabitCompletion={toggleHabitCompletion}
                    addHabit={addHabit}
                    currentDate={currentDate}
                    categoryIcons={categoryIcons}
                  />
                } 
              />
              <Route 
                path="/habit/:id" 
                element={
                  <HabitDetails 
                    habits={habits}
                    categoryIcons={categoryIcons}
                  />
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <Goals 
                    goals={goals}
                    addGoal={addGoal}
                    updateGoalProgress={updateGoalProgress}
                    toggleMilestone={toggleMilestone}
                    categoryIcons={categoryIcons}
                  />
                } 
              />
              <Route 
                path="/achievements" 
                element={
                  <Achievements 
                    achievements={achievements}
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings />
                } 
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;