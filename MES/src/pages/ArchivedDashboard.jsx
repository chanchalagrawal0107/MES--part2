import React, { Component } from "react";
import axios from "axios";

class ArchivedDashboard extends Component {
  state = {
    files: [],
    selectedFile: null,
  };

  componentDidMount() {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "Approver") {
      window.location.replace("/");
      return;
    }

    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/archived/files", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      this.setState({ files: res.data });
    } catch (error) {
      console.error("❌ Error loading archived files:", error);
      alert("Error loading archived files");
    }
  };

  handleFileClick = (file) => {
    this.setState({ selectedFile: file });
  };

  render() {
    const { files, selectedFile } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center text-dark mb-5 display-5 fw-bold border-bottom pb-2">
          📁 Archived Reports
        </h1>

        {/* Grid of Archived Files */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {files.map((file) => (
            <div className="col" key={file}>
              <div className="card h-100 border border-info shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-primary fw-semibold text-truncate">
                    🧾 {file}
                  </h6>
                  <button
                    className="btn btn-outline-info mt-auto fw-medium"
                    onClick={() => this.handleFileClick(file)}
                    style={{ backgroundColor: "#17a2b8", color: "white", border: "none" }}
                  >
                    Preview Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Section */}
        {selectedFile && (
          <div className="card mt-5 shadow border border-dark">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📄 Previewing: {selectedFile}</h5>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => this.setState({ selectedFile: null })}
              >
                ❌ Close Preview
              </button>
            </div>
            <div className="card-body p-0 bg-light">
              <iframe
                src={`http://localhost:5000/reports/approved/${selectedFile}`}
                width="100%"
                height="600px"
                title={selectedFile}
                style={{ border: "none" }}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ArchivedDashboard;
