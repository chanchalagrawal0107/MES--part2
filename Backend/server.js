const express = require("express");
const cors = require("cors");
const alarmRoutes = require("./routes/alarmsapi"); 
const authRoutes = require("./routes/auth");
const assetCentreRoutes = require("./routes/assetcentre_api");
const ssrsRoutes = require("./routes/ssrs_reports");
const authorAPI = require("./routes/authorapi");
const reviewerAPI = require("./routes/reviewerapi");
const approverAPI = require("./routes/approverapi");
const reportRoutes = require("./routes/reportRoutes");
const axios = require('axios');
const port = 5000;


let app = express();
app.use(cors()); 
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send({ status: 1, msg: "Home Page API" });
});

app.use('/api', authRoutes);
app.use('/api', alarmRoutes);
app.use('/api', assetCentreRoutes);
app.use('/api', ssrsRoutes);
app.use("/api", authorAPI);
app.use("/", reviewerAPI);
app.use("/api", approverAPI);

app.use(express.urlencoded({extended: true}));
app.use("/api/reports", reportRoutes);



app.listen(process.env.PORT || 5000, () =>{
  console.log(`Server running on port ${process.env.PORT || 5000}`)
});

