import React, { Component } from "react";

class ApproverCard extends Component {
  handleNavigate = () => {
    window.location.href = "/approve";
  };

  render() {
    return (
      <div className="dashboard-card" onClick={this.handleNavigate}>
        <div className="card-body">
          <h5 className="card-title">Approve Reports</h5>
          <p className="card-text">Give final approval and sign</p>
        </div>
      </div>
    );
  }
}

export default ApproverCard;
