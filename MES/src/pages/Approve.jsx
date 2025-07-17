import React, { Component } from 'react';
import axios from 'axios';

class ApproverDashboard extends Component {
  state = { files: [] };

  componentDidMount() { this.fetchFiles(); }

  fetchFiles = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/reports/approve/files', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    this.setState({ files: res.data });  // ✅ Fix: assuming res.data is an array
  } catch (error) {
    console.error("❌ Error loading approver files:", error.response?.data || error.message);
    alert('Error loading approver files');
  }
};


  handleSign = async (file) => {
    try {
      const res = await axios.post('http://localhost:5000/api/reports/approve/sign', {
        filename: file,
        role: 'approver'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      alert(res.data.message);
      this.fetchFiles();
    } catch {
      alert('Error approving file');
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h3>Approver Dashboard</h3>
        {this.state.files.map(file => (
          <div className="card mb-3" key={file}>
            <div className="card-header d-flex justify-content-between">
              <span>{file}</span>
              <button className="btn btn-primary btn-sm" onClick={() => this.handleSign(file)}>
                Approve & Move
              </button>
            </div>
            <div className="card-body">
              <iframe
                src={`http://localhost:5000/reports/reviewed/${file}`}
                width="100%" height="500px"
                title={file} frameBorder="0"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ApproverDashboard;
