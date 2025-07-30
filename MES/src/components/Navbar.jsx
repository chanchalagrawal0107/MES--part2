import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar-dark">
      <div className="container-fluid d-flex justify-content-end">
        <a className="logout-link" href="/">Logout</a>
      </div>
    </nav>
  );
}