import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiTrendingUp, FiAward, FiSettings, FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ categoryIcons }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      if (window.innerWidth > 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span>🌱 HabitGrow</span>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FiHome className="icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/goals" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FiTrendingUp className="icon" />
            <span>Goals</span>
          </NavLink>
          <NavLink 
            to="/achievements" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FiAward className="icon" />
            <span>Achievements</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FiSettings className="icon" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      
      {isMobile && (
        <button 
          className="mobile-menu-button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}
    </>
  );
};

export default Sidebar;