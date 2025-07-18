import React, { Component } from "react";

class ApproverCard extends Component {
  handleApproved = () => {
    window.location.href = "/archived";
  }  
  handleNavigate = () => {
    window.location.href = "/approve";
  };

  render() {
    return (
      <>
        <div className="dashboard-card" onClick={this.handleNavigate}>
          <div className="card-body">
            <h5 className="card-title">Approve Reports</h5>
            <p className="card-text">Give final approval and sign</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={this.handleApproved}>
          <div className="card-body">
            <h5 className="card-title">Archived</h5>
            <p className="card-text">View Archived Reports</p>
          </div>
        </div>
      </>
    );
  }
}

export default ApproverCard;
