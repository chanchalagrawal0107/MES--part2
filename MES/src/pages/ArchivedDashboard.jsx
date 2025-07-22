// pages/ArchivedDashboard.jsx
import React, { Component } from "react";
import axios from "axios";

class ArchivedDashboard extends Component {
  state = {
    files: []
  };

  componentDidMount() {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "Approver") {
      window.location.replace("/");
      return;
    }

    console.log("📦 ArchivedDashboard mounted");
    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      console.log("📤 Fetching archived files...");
      const res = await axios.get("http://localhost:5000/api/archived/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });

      console.log("✅ Archived files fetched:", res.data);
      this.setState({ files: res.data });
    } catch (error) {
      console.error("❌ Error loading archived files:", error);
      alert("Error loading archived files");
    }
  };

  render() {
    const { files } = this.state;

    return (
      <div className="container mt-5">
        <h3>📁 Archived Reports</h3>
        {files.length === 0 ? (
          <p>No archived reports found.</p>
        ) : (
          files.map((file) => (
            <div className="card mb-3" key={file}>
              <div className="card-header">
                <strong>{file}</strong>
              </div>
              <div className="card-body">
                <iframe
                  src={`http://localhost:5000/reports/approved/${file}`}
                  width="100%"
                  height="500px"
                  title={file}
                  frameBorder="0"
                />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default ArchivedDashboard;
