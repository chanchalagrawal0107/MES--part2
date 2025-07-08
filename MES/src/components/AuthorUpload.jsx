import React, { Component } from "react";

class AuthorUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",      // report name
      file: null,    // pdf file
    };
  }

  handleChange = (e) => {
    this.setState({ data: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.data || !this.state.file) {
      alert("Please provide both report name and PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("data", this.state.data); // report name
    formData.append("file", this.state.file); // PDF file
    formData.append("username", localStorage.getItem("username")); // logged-in author

    try {
      const res = await fetch("http://localhost:5000/api/reports/generate", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        this.setState({ data: "", file: null });
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h3>Generate Report</h3>
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Report Name:</label>
            <input
              type="text"
              className="form-control"
              name="data"
              value={this.state.data}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload PDF File:</label>
            <input
              type="file"
              className="form-control"
              name="file"
              accept=".pdf"
              onChange={this.handleFileChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Report
          </button>
        </form>
      </div>
    );
  }
}

export default AuthorUpload;