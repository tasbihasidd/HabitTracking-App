import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiTrendingUp, FiAward, FiSettings } from "react-icons/fi";

const Sidebar = ({ categoryIcons }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span>🌱 HabitGrow</span>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiHome className="icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiTrendingUp className="icon" />
          <span>Goals</span>
        </NavLink>
        <NavLink to="/achievements" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiAward className="icon" />
          <span>Achievements</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FiSettings className="icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;