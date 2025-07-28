import React, { Component } from "react";
import axios from "axios";

class ReviewerDashboard extends Component {
  state = {
    files: [],
    selectedFile: null,
  };

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files/reviewer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      this.setState({ files: res.data.files });
    } catch (err) {
      alert("Error loading reviewer files", err);
    }
  };

  handleFileClick = (file) => {
    this.setState({ selectedFile: file });
  };

  handleSign = async () => {
    const { selectedFile } = this.state;
    if (!selectedFile) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reports/review/sign",
        {
          filename: selectedFile,
          reviewer: localStorage.getItem("username"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert(res.data.message);
      this.setState({ selectedFile: null });
      this.fetchFiles(); // Refresh file list
    } catch (err) {
      alert("Error signing file", err);
    }
  };

  render() {
    const { files, selectedFile } = this.state;

    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4 display-6"><b>Reviewer Dashboard</b></h2>

        {/* Report File Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {files.map((file) => (
            <div className="col" key={file}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate">{file}</h6>
                  <button
                    className="btn btn-outline-primary mt-auto"
                    onClick={() => this.handleFileClick(file)}
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
          <div className="card mt-5 shadow">
            <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
              <h5 className="mb-0">Previewing: {selectedFile}</h5>
              <button className="btn btn-light" onClick={this.handleSign}>
                ✅ Sign 
              </button>
            </div>
            <div className="card-body p-0">
              <iframe
                src={`http://localhost:5000/reports/generated/${selectedFile}`}
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

export default ReviewerDashboard;
