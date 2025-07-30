import React, { Component } from "react";

class AuthorCards extends Component {
  handleAlarmsReport = () => {
    window.location.href = "/author/reports";
  };

  handleAuditReport = () => {
   window.location.href = "/audit/reports";
  };

  render() {
    return (
      <div className="dashboard-container">
        <div className="card-custom fade-in card-clickable" onClick={this.handleAlarmsReport}>
          <div className="card-body-custom text-center">
            <h5 className="card-title mb-2">Alarms Report</h5>
            <p className="card-text">Click to generate Alarms Report</p>
          </div>
        </div>

        <div className="card-custom fade-in card-clickable" onClick={this.handleAuditReport}>
          <div className="card-body-custom text-center">
            <h5 className="card-title mb-2">Audit Report</h5>
            <p className="card-text">Click to generate Audit Report</p>
          </div>
        </div>
      </div>
    );
  }
}


export default AuthorCards;