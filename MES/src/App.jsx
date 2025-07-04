import React, { Component } from "react";
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
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={this.handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/register" element={<this.RegisterWithNavigate />} />
          <Route path="/reset" element={<this.ResetWithNavigate />} />
          <Route
            path="/review"
            element={
              <ProtectedRouteWithRole allowedRole="Reviewer">
                <Review />
              </ProtectedRouteWithRole>
            }
          />

          <Route
            path="/approve"
            element={
              <ProtectedRouteWithRole allowedRole="Approver">
                <Approve />
              </ProtectedRouteWithRole>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
