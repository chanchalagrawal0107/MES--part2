import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

class Approve extends Component {
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
      const res = await fetch("http://localhost:5000/api/reports/approve");
      const data = await res.json();
      this.setState({ reports: data });
    } catch (error) {
      console.error("Error fetching approval reports:", error);
    }
  };

  handleApproveAndSign = async (reportId) => {
    const approverName = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/api/reports/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, approverName }),
      });

      const data = await res.json();
      alert(data.message);
      this.fetchReports();
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="content-container">
          <h2 className="text-center">Reports Pending Approval</h2>

          {this.state.reports.map((report) => (
            <div className="report-box" key={report.id}>
              <p><strong>Reviewed by:</strong> {report.reviewer}</p>
              <p><strong>Report Content:</strong> {report.data}</p>
              <div className="button-container text-center">
                <button
                  className="btn btn-success"
                  onClick={() => this.handleApproveAndSign(report.id)}
                >
                  Approve and Sign
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default Approve;
