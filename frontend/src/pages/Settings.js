import React, { useState } from "react";
import { FiSettings, FiBell, FiUser, FiSave } from "react-icons/fi";

const Settings = () => {
  const [settings, setSettings] = useState({
    username: "User",
    email: "user@example.com",
    notifications: {
      email: true,
      push: true,
      reminderTime: "20:00"
    },
    theme: "light"
  });
  const [saveStatus, setSaveStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("notifications.")) {
      const notificationField = name.split(".")[1];
      setSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          [notificationField]: type === "checkbox" ? checked : value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save settings to backend here
    setSaveStatus("success");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Theme handling in a real app would involve CSS or a theme context
  const applyTheme = (theme) => {
    // This is a simplified version - in a real app, we would use Context or CSS variables
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <section className="section">
          <h2 className="section-title">
            <FiUser className="inline mr-2" />
            Profile Settings
          </h2>
          
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className="form-input"
              type="text"
              id="username"
              name="username"
              value={settings.username}
              onChange={handleInputChange}
              placeholder="Your username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              placeholder="Your email address"
            />
          </div>
        </section>
        
        <section className="section mt-6">
          <h2 className="section-title">
            <FiBell className="inline mr-2" />
            Notification Settings
          </h2>
          
          <div className="form-checkbox mb-4">
            <input
              type="checkbox"
              id="notifications.email"
              name="notifications.email"
              checked={settings.notifications.email}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="notifications.email">
              Email Notifications
            </label>
          </div>
          
          <div className="form-checkbox mb-4">
            <input
              type="checkbox"
              id="notifications.push"
              name="notifications.push"
              checked={settings.notifications.push}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="notifications.push">
              Push Notifications
            </label>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="notifications.reminderTime">
              Daily Reminder Time
            </label>
            <input
              className="form-input"
              type="time"
              id="notifications.reminderTime"
              name="notifications.reminderTime"
              value={settings.notifications.reminderTime}
              onChange={handleInputChange}
            />
          </div>
        </section>
        
        <section className="section mt-6">
          <h2 className="section-title">
            <FiSettings className="inline mr-2" />
            Appearance
          </h2>
          
          <div className="form-group">
            <label className="form-label" htmlFor="theme">Theme</label>
            <select
              className="form-select"
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={(e) => {
                handleInputChange(e);
                applyTheme(e.target.value);
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </section>
        
        <div className="form-actions mt-6">
          <button type="submit" className="form-button">
            <FiSave className="inline mr-2" />
            Save Settings
          </button>
          
          {saveStatus === "success" && (
            <div className="mt-3 p-2 bg-green-100 text-green-700 rounded">
              Settings saved successfully!
            </div>
          )}
          
          {saveStatus === "error" && (
            <div className="mt-3 p-2 bg-red-100 text-red-700 rounded">
              Error saving settings. Please try again.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Settings;