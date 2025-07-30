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

<<<<<<< HEAD
          <div className="report-filter">
            <label className="form-label-custom">Filter by Report Type:</label>
            <select
              className="form-control-custom"
=======
          {/* Filter Dropdown */}
          <div className="mb-4">
            <label className="form-label"><b>Filter by Report Type:</b></label>
            <select
              className="form-select"
>>>>>>> eaf1ece763b944c6054580a9928ac9829b546ad4
              value={filter}
              onChange={this.handleFilterChange}
            >
              <option value="all">All Reports</option>
              <option value="alarms">Alarms Reports</option>
              <option value="assetcentre">Asset Centre Reports</option>
            </select>
          </div>

<<<<<<< HEAD
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
=======
          {/* Grid of Report Cards */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredFiles.map((file) => (
              <div className="col" key={file}>
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate">{file}</h6>
                    <button
                      className="btn btn-outline-success mt-auto"
                      onClick={() => this.handleFileClick(file)}
                    >
                      Preview Report
                    </button>
                  </div>
>>>>>>> eaf1ece763b944c6054580a9928ac9829b546ad4
                </div>
              </div>
            ))}
          </div>

          {selectedFile && (
            <div className="preview-container fade-in">
              <div className="preview-header">
                <h5 className="mb-0">Previewing: {selectedFile}</h5>
<<<<<<< HEAD
                <button 
                  className="btn-custom btn-primary-custom"
                  onClick={this.handleApprove}
                >
                  ✅ Approve Report
=======
                <button className="btn btn-light" onClick={this.handleApprove}>
                  ✅ Approve
>>>>>>> eaf1ece763b944c6054580a9928ac9829b546ad4
                </button>
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