import React, { Component } from "react";

class ReviewerCard extends Component {
  handleNavigate = () => {
    window.location.href = "/review";
  };

  render() {
    return (
      <div className="dashboard-card" onClick={this.handleNavigate}>
        <div className="card-body">
          <h5 className="card-title">Review Reports</h5>
          <p className="card-text">Check reports from authors and sign</p>
        </div>
      </div>
    );
  }
}

export default ReviewerCard;
