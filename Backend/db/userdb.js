const sql = require('mssql');

const userDbConfig = {
  user: "sa",
  password: "Rockwell1",
  server: "rapc",
  database: "User Database",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: "mssql",
  },
  port: 1433,
};

const poolPromise = new sql.ConnectionPool(userDbConfig)
  .connect()
  .then(pool => {
    console.log("Connected to User Database");
    return pool;
  })
  .catch(err => console.log("User DB connection error:", err));

module.exports = { sql, poolPromise };
