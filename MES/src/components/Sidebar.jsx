import React from 'react';
// import { a } from 'react-router-dom';

export default function Sidebar() {
  return (
    <>
      <div className="offcanvas offcanvas-start bg-light" tabIndex="-1" id="sidebar" aria-labelledby="sidebarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarLabel">Sidebar Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-a" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-a" href="/register">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-a" href="/reset-password">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
