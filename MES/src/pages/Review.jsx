import React, { Component } from "react";
import axios from "axios";

class ReviewerDashboard extends Component {
  state = {
    files: [],
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

  handleSign = async (file) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/reports/review/sign",
        {
          filename: file,
          // role: "reviewer",
          // username: localStorage.getItem("username")
          reviewer: localStorage.getItem("username"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert(res.data.message);
      this.fetchFiles();
    } catch (err) {
      alert("Error signing file",err);
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h3>Reviewer Dashboard</h3>
        {this.state.files.map((file) => (
          <div className="card mb-4" key={file}>
            <div className="card-header d-flex justify-content-between">
              <span>{file}</span>
              <button className="btn btn-sm btn-success" onClick={() => this.handleSign(file)}>
                Sign & Move to Reviewed
              </button>
            </div>
            <div className="card-body">
              <iframe
                src={`http://localhost:5000/reports/generated/${file}`}
                width="100%"
                height="500px"
                title={file}
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ReviewerDashboard;
