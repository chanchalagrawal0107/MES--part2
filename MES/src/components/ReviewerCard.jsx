import React, { Component } from "react";

class ReviewerCard extends Component {
  handleNavigate = () => {
    window.location.href = "/review";
  };

  render() {
    return (
      <div className="dashboard-container">
        <div className="card-custom fade-in card-clickable" onClick={this.handleNavigate}>
        <div className="card-body-custom text-center">
          <h5 className="card-title mb-2">Review Reports</h5>
          <p className="card-text">Check reports from authors and sign</p>
        </div>
      </div>
      </div>
      
    );
  }
}

export default ReviewerCard;
