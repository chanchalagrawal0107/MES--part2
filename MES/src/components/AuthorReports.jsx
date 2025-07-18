// import React, { Component } from "react";

// class AuthorReports extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       startDate: "",
//       endDate: "",
//       previewData: [],
//     };
//   }

//   handleFilterChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   fetchPreview = async () => {
//     const { startDate, endDate } = this.state;
//     try {
//       const res = await fetch(`http://localhost:5000/api/reports/preview?start_date=${startDate}&end_date=${endDate}`);
//       const data = await res.json();
//       this.setState({ previewData: data });
//     } catch (err) {
//       alert("Error fetching preview");
//     }
//   };

//   handleGenerateReport = async () => {
//     const { startDate, endDate } = this.state;
//     const username = localStorage.getItem("username");

//     try {
//       const res = await fetch("http://localhost:5000/api/reports/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ startDate, endDate, username }),
//       });

//       const result = await res.json();
//       if (res.ok) alert(result.message);
//       else alert("Error: " + result.message);
//     } catch (err) {
//       alert("Error generating report");
//     }
//   };

//   render() {
//     const { previewData } = this.state;

//     return (
//       <div className="container mt-5">
//         <h3>Author Report Generator</h3>

//         <div className="row mb-3">
//           <div className="col">
//             <label>Start Date</label>
//             <input type="date" className="form-control" name="startDate" onChange={this.handleFilterChange} />
//           </div>
//           <div className="col">
//             <label>End Date</label>
//             <input type="date" className="form-control" name="endDate" onChange={this.handleFilterChange} />
//           </div>
//           <div className="col d-flex align-items-end">
//             <button className="btn btn-info" onClick={this.fetchPreview}>Preview Report</button>
//           </div>
//         </div>

//         {previewData.length > 0 && (
//           <>
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   {Object.keys(previewData[0]).map((key, idx) => (
//                     <th key={idx}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.map((row, idx) => (
//                   <tr key={idx}>
//                     {Object.values(row).map((value, i) => (
//                       <td key={i}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <button className="btn btn-primary mt-3" onClick={this.handleGenerateReport}>
//               Generate PDF Report
//             </button>
//           </>
//         )}
//       </div>
//     );
//   }
// }

// export default AuthorReports;

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
      // "EventID",
      // "EventType",
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
        `http://localhost:5000/api/reports/preview?start_date=${startDate}&end_date=${endDate}`
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
    const username = localStorage.getItem("username");

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate, username }),
      });

      const result = await res.json();
      if (res.ok) alert(result.message);
      else alert("Error: " + result.message);
    } catch (err) {
      console.error(err);
      alert("Error generating report");
    }
  };

  handlePrint = () => {
    window.print();
  };

  render() {
    const { startDate, endDate, previewData } = this.state;

    return (
      <div className="container mt-5">
        <h3 className="mb-4">Author Report Generator</h3>

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
    {/* {previewData.length > 0 && (
      <button className="btn btn-info" onClick={this.handlePrint}>
        🖨️ Print Report
      </button>
    )} */}
    
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