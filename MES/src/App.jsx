import Login from './pages/Login'
import Register from './pages/Register'
import Reset from './pages/Reset'
import React, {Component} from 'react'
import Dashboard from './pages/Dashboard'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useNavigate} from 'react-router-dom'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }
  RegisterWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Register {...props} navigate={navigate} />;
  };
    
  // try {
  //   const response = await fetch('http://localhost:5000/api/token/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     localStorage.setItem('authToken', data.access); // storing JWT token
  //     this.setState({ isAuthenticated: true });
  //   } else {
  //     alert('Invalid Credentials');
  //   }
  // } catch (error) {
  //   console.error('Login error:', error);
  //   alert('Login failed. Please try again.');
  // }
  handleLogin = async (username, password) => {
    if (username === 'admin' && password === 'admin') {
        this.setState({ isAuthenticated: true });
      } else {
        alert('Invalid credentials');
      }
  };


  handleLogout = () => {
    this.setState({ isAuthenticated: false});
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
                // <Dashboard onLogout={this.handleLogout} />
                <Dashboard/>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/register" element={<this.RegisterWithNavigate />} />
          <Route path="/reset" element={<Reset />} />
        </Routes>
      </Router>
    );
  }
}

 

export default App;