// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../reports/generated")); // resolved path
//   },
//   filename: function (req, file, cb) {
//     const { data } = req.body;
//     const filename = `${data}_generated.pdf`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;