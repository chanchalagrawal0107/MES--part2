import React, { Component } from "react";
import axios from "axios";

class ArchivedDashboard extends Component {
  state = {
    files: [],
    selectedFile: null,
    filter: "all",
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

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value });
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
      <div className="container mt-5">
<<<<<<< HEAD
        <h1 className="archived-heading">
          Archived Reports
        </h1>

        <div className="report-filter">
          <label className="form-label">Filter by Report Type:</label>
=======
        <h1 className="text-center text-dark mb-4 display-5 fw-bold border-bottom pb-2">
          📁 Archived Reports
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label className="form-label"><b>Filter by Report Type:</b></label>
>>>>>>> eaf1ece763b944c6054580a9928ac9829b546ad4
          <select
            className="form-select"
            value={filter}
            onChange={this.handleFilterChange}
          >
            <option value="all">All Reports</option>
            <option value="alarms">Alarms Reports</option>
            <option value="assetcentre">Asset Centre Reports</option>
          </select>
        </div>

<<<<<<< HEAD
=======
        {/* Grid of Archived Files */}
>>>>>>> eaf1ece763b944c6054580a9928ac9829b546ad4
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredFiles.map((file) => (
            <div className="col" key={file}>
              <div className="card report-card border border-info">
                <div className="card-body report-card-body">
                  <h6 className="card-title text-primary fw-semibold text-truncate">
                    🧾 {file}
                  </h6>
                  <button
                    className="btn btn-outline-info btn-preview"
                    onClick={() => this.handleFileClick(file)}
                  >
                    Preview Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedFile && (
          <div className="card preview-card border border-dark">
            <div className="preview-header archived">
              <h5 className="mb-0">📄 Previewing: {selectedFile}</h5>
              <button
                className="btn btn-close-preview-sm"
                onClick={() => this.setState({ selectedFile: null })}
              >
                ❌ Close Preview
              </button>
            </div>
            <div className="card-body p-0 bg-light">
              <iframe
                src={`http://localhost:5000/reports/approved/${selectedFile}`}
                className="report-iframe"
                title={selectedFile}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ArchivedDashboard;
