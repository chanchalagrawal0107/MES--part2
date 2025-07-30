import React, { Component } from "react";

class AuthorReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      previewData: [],
    };

    this.displayColumns = [
      "SourceName",
      "ServerName",
      "EventTimeStamp",
      "Severity",
      "Priority",
      "Message",
      "ConditionName",
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
        `http://localhost:5000/api/reports/preview?start_date=${startDate}&end_date=${endDate}&source=alarms`
      );
      const data = await res.json();
      this.setState({ previewData: data || [] });
    } catch (err) {
      console.error(err);
      alert("Error fetching preview");
    }
  };

  handleGenerateReport = async () => {
    const { startDate, endDate } = this.state;
    const username = localStorage.getItem("username") || "unknown_user";

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
          username,
          source: "alarms",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate report");
      }

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error("Error generating report:", err);
      alert(err.message || "Error generating report");
    }
  };

  render() {
    const { startDate, endDate, previewData } = this.state;

    return (
      <div className="audit-reports-container">
        <h2 className="audit-reports-heading">Alarms Report Generator</h2>

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

            <div className="audit-action-buttons" style={{ marginTop: "2rem" }}>
              <button
                className="btn-audit btn-generate"
                onClick={this.handleGenerateReport}
              >
                Generate PDF Report
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default AuthorReports;