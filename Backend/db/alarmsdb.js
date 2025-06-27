const sql = require('mssql');

const alarmDbConfig = {
  user: "sa",
  password: "Rockwell1",
  server: "rapc",
  database: "Alarms",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "mssql",
  },
  port: 1433,
};

// Connect and return poolPromise
const poolPromise = new sql.ConnectionPool(alarmDbConfig)
  .connect()
  .then(pool => {
    console.log("✅ Connected to Alarms Database");
    return pool;
  })
  .catch(err => {
    console.log("❌ Alarms DB connection error:", err.message);
    throw err;
  });

// Export correctly
module.exports = { sql, poolPromise };
