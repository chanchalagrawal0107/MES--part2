import React, { Component } from "react";
import Reports from "./components/Reports.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import Review from "./pages/Review.jsx";
import Approve from "./pages/Approve.jsx";
import ProtectedRouteWithRole from "./components/ProtectedRouteWithRole";
import Unauthorized from "./pages/Unauthorized.jsx";
import AuthorReports from "./components/AuthorReports.jsx";
import ArchivedDashboard from "./pages/ArchivedDashboard.jsx";
import AuditReports from "./components/AuditReports.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  handleLogin = (username, password, role) => {
    this.setState({ isAuthenticated: true });
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", username);
  };

  handleLogout = () => {
    this.setState({ isAuthenticated: false });
    localStorage.removeItem("authToken");
  };

  RegisterWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Register {...props} navigate={navigate} />;
  };

  ResetWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Reset {...props} navigate={navigate} />;
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={this.handleLogin} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes with Role-based Access */}
          <Route element={<ProtectedRouteWithRole allowedRoles={['Author', 'Reviewer', 'Approver']} />}>
            <Route path="/dashboard" element={<Dashboard onLogout={this.handleLogout} />} />
          </Route>

          <Route element={<ProtectedRouteWithRole allowedRoles={['Author']} />}>
            <Route path="/author/reports" element={<AuthorReports />} />
          </Route>

          <Route element={<ProtectedRouteWithRole allowedRoles={['Approver']} />}>
            <Route path="/audit/reports" element={<AuditReports />} />
            <Route path="/archived" element={<ArchivedDashboard />} />
          </Route>

          <Route element={<ProtectedRouteWithRole allowedRoles={['Reviewer']} />}>
            <Route path="/review" element={<Review />} />
          </Route>

          <Route element={<ProtectedRouteWithRole allowedRoles={['Approver']} />}>
            <Route path="/approve" element={<Approve />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
