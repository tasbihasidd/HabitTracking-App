import React from "react";
import { FiAward, FiLock, FiUnlock } from "react-icons/fi";
import { format, parseISO } from "date-fns";

const Achievements = ({ achievements }) => {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);
  
  return (
    <div className="achievements-page">
      <h1>Achievements</h1>
      
      <section className="section">
        <h2 className="section-title mb-4">
          <FiAward className="inline-block mr-2" />
          Your Achievements
        </h2>
        
        {unlockedAchievements.length === 0 ? (
          <div className="empty-state">
            <p>You haven't unlocked any achievements yet. Keep up your habits to earn rewards!</p>
          </div>
        ) : (
          <div className="achievements-grid">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">
                  <FiAward size={24} />
                </div>
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-date">
                  <FiUnlock className="inline mr-1" size={12} />
                  Unlocked on {achievement.unlockedDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {lockedAchievements.length > 0 && (
        <section className="section mt-6">
          <h2 className="section-title mb-4">
            <FiLock className="inline-block mr-2" />
            Achievements to Unlock
          </h2>
          
          <div className="achievements-grid">
            {lockedAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-card locked">
                <div className="achievement-icon">
                  <FiLock size={24} />
                </div>
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-date text-yellow-600">
                  Keep going to unlock!
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      <section className="section mt-6">
        <h2 className="section-title">Your Stats</h2>
        <div className="stats-summary grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="stat-box bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {unlockedAchievements.length}
            </div>
            <div className="text-gray-500">Achievements Unlocked</div>
          </div>
          <div className="stat-box bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-gray-500">Completion Rate</div>
          </div>
          <div className="stat-box bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {lockedAchievements.length}
            </div>
            <div className="text-gray-500">More to Unlock</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;