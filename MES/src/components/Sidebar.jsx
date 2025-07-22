import React from 'react';

export default function Sidebar() {
  return (
    <div
      className="offcanvas offcanvas-start custom-sidebar"
      tabIndex="-1"
      id="sidebar"
      aria-labelledby="sidebarLabel"
    >
      <div className="sidebar-header">
        <h5 className="sidebar-title" id="sidebarLabel">Sidebar Menu</h5>
        <button type="button" className="close-btn" data-bs-dismiss="offcanvas" aria-label="Close">×</button>
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          <li className="nav-item">
            <a className="sidebar-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="sidebar-link" href="/register">About</a>
          </li>
          <li className="nav-item">
            <a className="sidebar-link" href="/reset-password">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
