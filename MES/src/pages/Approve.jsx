import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

class Approve extends Component {
  handleApproveAndSign = () => {
    alert("Report approved and signed!");
    // TODO: Add backend call here if needed
  };

  render() {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="content-container">
          <h2 className="text-center">Reports Pending Approval</h2>

          {/* Sample report placeholder */}
          <div className="report-box">
            <p><strong>Report Title:</strong> Alarms Report - 03 July 2025</p>
            <p><strong>Status:</strong> Reviewed by Reviewer</p>
          </div>

          <div className="button-container text-center">
            <button className="btn btn-success" onClick={this.handleApproveAndSign}>
              Approved and Sign
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Approve;
