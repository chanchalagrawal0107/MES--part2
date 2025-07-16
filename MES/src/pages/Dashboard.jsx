import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import AuthorCards from "../components/AuthorCards.jsx";
import ReviewerCard from "../components/ReviewerCard.jsx";
import ApproverCard from "../components/ApproverCard.jsx";
import AuthorUpload from "../components/AuthorUpload.jsx";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
    };
  }

  componentDidMount() {
    const storedRole = localStorage.getItem("userRole");
    this.setState({ role: storedRole });
  }

  render() {
    const { role } = this.state;

    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="dashboard-container">
          {role === "Author" && <AuthorCards />}
          {role === "Reviewer" && <ReviewerCard />}
          {role === "Approver" && <ApproverCard />}
        </div>
        
      </>
    );
  }
}

export default Dashboard;
