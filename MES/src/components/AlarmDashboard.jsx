import React, { Component } from 'react';
import { fetchAlarms } from '../api/alarmsAPI'; // ✅ import API function

class AlarmDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarms: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.loadAlarms();
  }

  loadAlarms = async () => {
    try {
      const data = await fetchAlarms();
      this.setState({ alarms: data, loading: false });
    } catch (error) {
      this.setState({ error: 'Failed to load alarms', loading: false });
    }
  };

  render() {
    const { alarms, loading, error } = this.state;

    if (loading) return <div>Loading alarms...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div>
        <h2>Alarm Dashboard</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>EventID</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm, index) => (
              <tr key={index}>
                <td>{alarm.EventID}</td>
                <td>{alarm.Message}</td>
                <td>{alarm.Timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AlarmDashboard;
