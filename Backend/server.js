const express = require("express");
const cors = require("cors");
const path = require("path");

const alarmRoutes = require("./routes/alarmsapi");
const authRoutes = require("./routes/auth");
const assetCentreRoutes = require("./routes/assetcentre_api");
const authorAPI = require("./routes/authorapi");
const reviewerAPI = require("./routes/reviewerapi");
const approverAPI = require("./routes/approverapi");
const reportRoutes = require("./routes/reportRoutes");
const nodeReport = require("./routes/nodeReport");
const reportGenerator = require('./routes/reportGenerator');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/reports/generated', express.static(path.join(__dirname, 'reports/generated')));
app.use('/reports/reviewed', express.static(path.join(__dirname, 'reports/reviewed')));
app.use('/reports/approved', express.static(path.join(__dirname, 'reports/approved')));
app.use('/api', reportGenerator);


// Root route
app.get("/", (req, res) => {
  res.send({ status: 1, msg: "Home Page API" });
});

// API route groupings
app.use("/api", authRoutes);
app.use("/api", alarmRoutes);
app.use("/api", assetCentreRoutes);
app.use("/api", reportRoutes);
app.use("/api", nodeReport);

// Report workflow routes (author, reviewer, approver)
app.use("/api/reports", authorAPI);
app.use("/api/reports", reviewerAPI);
app.use("/api/reports", approverAPI);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
