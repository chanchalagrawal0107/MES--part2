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
      <div className="dashboard-container">
        <div className="card-custom fade-in card-clickable" onClick={this.handleNavigate}>
          <div className="card-body-custom text-center">
            <h5 className="card-title mb-2">Approve Reports</h5>
            <p className="card-text">Give final approval and sign</p>
          </div>
        </div>

        <div className="card-custom fade-in card-clickable" onClick={this.handleApproved}>
          <div className="card-body-custom text-center">
            <h5 className="card-title mb-2">Archived</h5>
            <p className="card-text">View Archived Reports</p>
          </div>
        </div>
      </div>
     
    );
  }
}

export default ApproverCard;
