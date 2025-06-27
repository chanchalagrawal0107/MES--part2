import React, { Component } from "react";
import "../style.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      emailID: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password, emailID } = this.state;
    this.props.onRegister(username, password, emailID);
  };

  render() {
    return (
      <div className="bg">
        <div className="login-panel">
          <h2 className="h2">Register</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="username">
              <label htmlFor="username" className="form-label"><b>Username</b></label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="password">
              <label htmlFor="password" className="form-label"><b>Password</b></label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="password">
              <label htmlFor="emailID" className="form-label"><b>Email</b></label>
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

            <button type="submit" className="login-button">
              Register
            </button>

            <p className="text-center">
              Already have an account? <a href="#" className="reset">Login</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;