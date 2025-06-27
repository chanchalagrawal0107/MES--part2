const express = require("express");
const cors = require("cors");
const eventRoutes = require("./routes/event");
const authRoutes = require("./routes/auth");
const alarmRoutes = require("./routes/alarms"); 


let app = express();
app.use(cors()); 
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send({ status: 1, msg: "Home Page API" });
});

app.use('/api', authRoutes); //MIDDLEWARE
app.use('/api', alarmRoutes); //MIDDLEWARE
app.use('/api', eventRoutes); //MIDDLEWARE

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

