const express = require("express");
const cors = require("cors");
const alarmRoutes = require("./routes/alarmsapi"); 


// const authRoutes = require("../routes/auth");
// require('dotenv').config();
// const { sql, poolPromise } = require('./db/alarmsdb');

let app = express();
app.use(cors()); 
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send({ status: 1, msg: "Home Page API" });
});

// app.get("/api/alarms", async (req, res) => {
//   try{
//     const pool = await poolPromise;
//     const result =  await pool.request().query('SELECT * FROM AllEvent');

//     res.json(result.recordset)
//   } catch(err) {
//     console.error('Query error:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });


// app.use('/api', authRoutes);

app.use('/api', alarmRoutes);

app.listen(process.env.PORT || 5000, () =>{
  console.log(`Server running on port ${process.env.PORT || 5000}`)
});

