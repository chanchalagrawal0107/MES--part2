import React, { Component } from "react";
import Navbar from "./Navbar";

class AuditReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      previewData: [],
    };

    this.displayColumns = [
      "RecordID",
      "DateTimeOccurred",
      "EventSource",
      "Location",
      "Resource",
      "UserName",
      "Message",
      "DateTimeLogged",
      "AttachmentCount",
    ];
  }

  handleFilterChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetchPreview = async () => {
    const { startDate, endDate } = this.state;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/reports/preview?start_date=${startDate}&end_date=${endDate}&source=assetcentre`
      );
      const data = await res.json();
      this.setState({ previewData: data || [] });
    } catch (err) {
      console.error(err);
      alert("Error fetching preview");
    }
  };

handleGenerateReport_Audit = async () => {
  const { startDate, endDate } = this.state;
  const username = localStorage.getItem("username") || 'unknown_user'; 
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/reports/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}` // Add auth header
      },
      body: JSON.stringify({
        startDate,
        endDate,
        username,
        source: "assetcentre"
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
    } else {
      alert("Error: " + (result.message || 'Failed to generate report'));
    }
  } catch (err) {
    console.error("Error generating report:", err);
    alert("Error generating report. Check console for details.");
  }
};
  render() {
    const { startDate, endDate, previewData } = this.state;

    return (
      <>
      <Navbar/>
      <div className="audit-reports-container">
        <h2 className="audit-reports-heading">Audit Report Generator</h2>

        <div className="audit-filters">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={this.handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={this.handleFilterChange}
            />
          </div>

          <div className="audit-action-buttons">
            <button 
              className="btn-audit btn-preview" 
              onClick={this.fetchPreview}
            >
              Preview Report
            </button>
          </div>
        </div>

        {previewData.length > 0 && (
          <>
            <div className="audit-table-container">
              <table className="audit-table">
                <thead>
                  <tr>
                    {this.displayColumns.map((key, idx) => (
                      <th key={idx}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {this.displayColumns.map((col, i) => (
                        <td key={i}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="audit-action-buttons" style={{marginTop: '2rem'}}>
              <button
                className="btn-audit btn-generate"
                onClick={this.handleGenerateReport_Audit}
              >
                Generate PDF Report
              </button>
            </div>
          </>
        )}
      </div>
      </>
      
    );
  }
}


export default AuditReports;