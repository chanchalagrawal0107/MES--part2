import React, { Component } from "react";
import axios from "axios";

class ArchivedDashboard extends Component {
  state = {
    files: []
  };

  componentDidMount() {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    // ✅ Secure check for token and role
    if (!token || role !== "Approver") {
      window.location.replace("/"); // Clear history and redirect
      return;
    }

    this.fetchFiles(); // Only fetch if authenticated
  }

  fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/archived/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      this.setState({ files: res.data });
    } catch (error) {
      console.error("❌ Error loading archived files:", error);
      alert("Error loading archived files");
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h3>Archived Reports</h3>
        {this.state.files.map(file => (
          <div className="card mb-3" key={file}>
            <div className="card-header">
              <strong>{file}</strong>
            </div>
            <div className="card-body">
              <iframe
                src={`http://localhost:5000/reports/approved/${file}`}
                width="100%" height="500px"
                title={file}
                frameBorder="0"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ArchivedDashboard;
