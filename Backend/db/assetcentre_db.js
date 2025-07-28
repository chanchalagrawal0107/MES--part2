const sql = require('mssql');

const config = {
  user: "sa",
  password: "Rockwell1",
  server: "rapc",
  database: "AssetCentre",
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: "mssql",
  },
  port: 1433,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to AssetCentre Database');
    return pool;
  })
  .catch(err => console.log('Database connection failed:', err));

module.exports = {
  sql,
  poolPromise,
};


