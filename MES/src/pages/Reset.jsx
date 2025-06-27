import React, { Component } from "react";
import "../style.css";

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      emailID: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, emailID } = this.state;
    this.props.onreset(username, emailID);
  };

  render() {
    return (
      <div className="bg">
        <div className="login-panel">
          <h2 className="h2">Reset Password</h2>

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
              Reset Password
            </button>

            <p className="text-center">
              New User? <a href="/register" className="register">Register</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Reset;