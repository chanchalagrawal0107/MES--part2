import React, { Component } from "react";
import "../style.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      emailID: '',
      role: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }); 
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, emailID, role } = this.state;

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: emailID,
          password,
          role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Redirecting to login...');
        this.props.navigate('/');
      } else {
        alert(data.message || 'Registration failed. Try a different username/email.');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Something went wrong during registration.');
    }
  };

  render() {
    return (
      <div className="auth-bg">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Register</h1>
            <p className="auth-subtitle">Create your manufacturing account</p>
          </div>
          
          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Choose a username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailID" className="form-label">Email</label>
              <input
                type="email"
                id="emailID"
                name="emailID"
                className="form-control"
                placeholder="Enter your email"
                value={this.state.emailID}
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
                placeholder="Create a password"
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
              Register
            </button>

            <div className="auth-footer">
              <p>
                Already have an account? <a href="/" className="auth-link">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;