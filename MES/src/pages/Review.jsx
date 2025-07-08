import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };
  }

  componentDidMount() {
    this.fetchReports();
  }

  fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports/generated"); // ✅ Use consistent API
      const data = await res.json();
      this.setState({ reports: data });
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  handleReviewAndSign = async (reportId) => {
    const reviewerName = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/api/reports/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, reviewerName }),
      });

      const data = await res.json();
      alert(data.message);
      this.fetchReports(); // ✅ Refresh report list
    } catch (error) {
      console.error("Error reviewing report:", error);
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="content-container">
          <h2 className="text-center">Reports Pending Review</h2>

          {this.state.reports.length === 0 ? (
            <p className="text-center">No reports pending review.</p>
          ) : (
            this.state.reports.map((report) => (
              <div className="report-box" key={report.id}>
                <p><strong>Submitted by:</strong> {report.author}</p>
                <p><strong>Report Content:</strong> {report.data}</p>
                <div className="button-container text-center">
                  <button
                    className="btn btn-warning"
                    onClick={() => this.handleReviewAndSign(report.id)}
                  >
                    Reviewed and Sign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  }
}

export default Review;
