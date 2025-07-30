import React, { Component } from "react";
import "../style.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      role:'',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, role } = this.state;

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Optional: Save token if you're using JWT
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('username', username);
        }

        this.props.onLogin(username, password, role);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login.');
    }
  };

  render() {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">Access your manufacturing system</p>
          </div>
          
          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                className="form-control role-select"
                value={this.state.role}
                onChange={this.handleChange}
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="Author">Author</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Approver">Approver</option>
              </select>
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>

            <div className="auth-footer">
              <p>
                New User? <a href="/register" className="auth-link">Register</a>
              </p>
              <p>
                <a href="/reset" className="auth-link">Forgot Password?</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;