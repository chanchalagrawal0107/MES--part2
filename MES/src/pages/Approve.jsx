import React, { Component } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

class ApproverDashboard extends Component {
  state = {
    files: [],
    selectedFile: null,
    filter: "all",
  };

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/approve/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      this.setState({ files: res.data });
    } catch (error) {
      console.error("❌ Error loading approver files:", error);
      alert("Error loading approver files");
    }
  };

  handleFileClick = (file) => {
    this.setState({ selectedFile: file });
  };

  handleApprove = async () => {
    const { selectedFile } = this.state;
    if (!selectedFile) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reports/approve/sign",
        {
          filename: selectedFile,
          role: "approver",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert(res.data.message);
      this.setState({ selectedFile: null });
      this.fetchFiles();
    } catch (error) {
      console.error("❌ Error approving file:", error);
      alert("Error approving file");
    }
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  getFilteredFiles = () => {
    const { files, filter } = this.state;
    if (filter === "all") return files;
    return files.filter((file) =>
      filter === "alarms"
        ? file.toLowerCase().startsWith("alarms")
        : file.toLowerCase().startsWith("assetcentre")
    );
  };

  render() {
    const { selectedFile, filter } = this.state;
    const filteredFiles = this.getFilteredFiles();

    return (
      <>
        <Navbar />
        <div className="container">
          <h2 className="dashboard-heading">Approver Dashboard</h2>

          <div className="report-filter">
            <label className="form-label-custom">Filter by Report Type:</label>
            <select
              className="form-control-custom"
              value={filter}
              onChange={this.handleFilterChange}
            >
              <option value="all">All Reports</option>
              <option value="alarms">Alarms Reports</option>
              <option value="assetcentre">Asset Centre Reports</option>
            </select>
          </div>

          <div className="report-card-grid">
            {filteredFiles.map((file) => (
              <div className="card-custom fade-in" key={file}>
                <div className="card-body-custom">
                  <h6 className="card-title text-truncate mb-3">{file}</h6>
                  <button
                    className="btn-custom btn-outline-custom"
                    onClick={() => this.handleFileClick(file)}
                  >
                    Preview Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedFile && (
            <div className="preview-container fade-in">
              <div className="preview-header">
                <h5 className="mb-0">Previewing: {selectedFile}</h5>
                <div className="preview-header-buttons">
                  <button
                    className="btn-custom btn-primary-custom"
                    onClick={this.handleApprove}
                  >
                    Approve Report
                  </button>
                  <button
                    className="btn-close-preview-sm"
                    onClick={() => this.setState({ selectedFile: null })}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
              <div className="p-0">
                <iframe
                  src={`http://localhost:5000/reports/reviewed/${selectedFile}`}
                  className="report-iframe"
                  title={selectedFile}
                ></iframe>
              </div>
            </div>
)}
        </div>
      </>
    );
  }
}

export default ApproverDashboard;