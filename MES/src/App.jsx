import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Reset from './pages/Reset';
import Dashboard from './pages/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  handleLogin = (username, password) => {
    this.setState({ isAuthenticated: true });
  };

  handleLogout = () => {
    this.setState({ isAuthenticated: false });
    localStorage.removeItem('authToken'); 
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
        </Routes>
      </Router>
    );
  }
}

export default App;
