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
      <>
        <div className="dashboard-card" onClick={this.handleAlarmsReport}>
          <div className="card-body">
            <h5 className="card-title">Alarms Report</h5>
            <p className="card-text">Click to generate Alarms Report</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={this.handleAuditReport}>
          <div className="card-body">
            <h5 className="card-title">Audit Report</h5>
            <p className="card-text">Click to generate Audit Report</p>
          </div>
        </div>
      </>
    );
  }
}

export default AuthorCards;


