import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar-dark">
      <div className="container-fluid">
        {/* <button
          className="btn-outline-light me-5"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}

        <a className="logout-link" href="/">Logout</a>
      </div>
    </nav>
  );
}
