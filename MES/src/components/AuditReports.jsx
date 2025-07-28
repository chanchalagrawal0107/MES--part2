import React, { Component } from "react";

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

//   handleGenerateReport_Audit = async () => {
//     const { startDate, endDate } = this.state;
//     const username = localStorage.getItem("username") || 'unknown_user';
//     if (!username) {
//       alert("User not logged in. Please log in again.");
//       return;
//     }

//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/reports/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           startDate,
//           endDate,
//           username,
//           source: "assetcentre" // Make sure this matches what the backend expects
//         }),
//       });

//       const result = await res.json();
//       if (res.ok) {
//         alert(result.message);
//       } else {
//         alert("Error: " + result.message);
//       }
//     } catch (err) {
//       console.error("Error generating report:", err);
//       alert("Error generating report. Check console for details.");
//     }
//   };

    // In AuditReports.jsx, modify the handleGenerateReport_Audit function:
handleGenerateReport_Audit = async () => {
  const { startDate, endDate } = this.state;
  const username = localStorage.getItem("username") || 'unknown_user'; // Provide a fallback

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
      <div className="container mt-5">
        <h3 className="mb-4">Audit Report Generator</h3>

        <div className="row align-items-center mb-3">
          <div className="col-md-2">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={startDate}
              onChange={this.handleFilterChange}
            />
          </div>

          <div className="col-md-2">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={endDate}
              onChange={this.handleFilterChange}
            />
          </div>

          <div className="col-md-8 d-flex justify-content-end gap-2">
            <button className="btn btn-info" onClick={this.fetchPreview}>
              Preview Report
            </button>
          </div>
        </div>

        {previewData.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
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

            <div className="text-center">
              <button
                className="btn btn-primary mt-3"
                onClick={this.handleGenerateReport_Audit}
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

export default AuditReports;