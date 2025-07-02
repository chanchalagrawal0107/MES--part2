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

  
// async function connectToDb() {
//   try {
//     const pool = await new sql.ConnectionPool(config).connect();
//     console.log('MSSQL Connected successfully');
//     return pool;
//   } catch (err) {
//     console.error('MSSQL Connection Failed:', err.message);
//     throw err;
//   }
// }
// poolPromise = connectToDb();

module.exports = {
  sql,
  poolPromise,
};
