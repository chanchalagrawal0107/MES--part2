import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

class Review extends Component {
  handleReviewAndSign = () => {
    alert("Report reviewed and signed!");
    // TODO: Implement actual backend call here if needed
  };

  render() {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="content-container">
          <h2 className="text-center">Reports Pending Review</h2>

          {/* Sample report placeholder */}
          <div className="report-box">
            <p><strong>Report Title:</strong> Alarms Report - 03 July 2025</p>
            <p><strong>Status:</strong> Submitted by Author</p>
          </div>

          <div className="button-container text-center">
            <button className="btn btn-warning" onClick={this.handleReviewAndSign}>
              Reviewed and Sign
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Review;
