require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

absolutePath = __dirname + "/views/index.html";
app.get("/", (req, res) => {
  res.sendFile(absolutePath);
});

app.use(express.static(__dirname + "/public"));

app.get(
  "/api",
  (req, res, next) => {
    req.unix = new Date().getTime();
    req.utc = new Date().toUTCString();
    next();
  },
  (req, res) => {
    res.json({ unix: req.unix, utc: req.utc });
  }
);
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Spt",
  "Oct",
  "Nov",
  "Dec",
];
app.get(
  "/api/:date",
  (req, res, next) => {
    let validDate = Date.parse(req.params.date);
    let validUnix = /^\d+$/;
    if (/^\d{4}-\d{1,2}-\d{0,2}/.test(req.params.date) && validDate) {
      let dateString = req.params.date.toString();
      req.unix = parseInt(new Date(dateString).getTime());
      req.utc = new Date(dateString).toUTCString();
      next();
    } else if (validUnix.test(req.params.date)) {
      let dateInt = parseInt(req.params.date);
      let dateObj = new Date(dateInt);
      let dayy = dateObj.getUTCDay();
      let day = DAYS[dayy];
      let date = dateObj.getUTCDate();
      let monthh = dateObj.getUTCMonth();
      let month = MONTHS[monthh];
      let year = dateObj.getUTCFullYear();
      let hours = dateObj.getUTCHours().toString().padStart(2, "0");
      let minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
      let seconds = dateObj.getUTCSeconds().toString().padStart(2, "0");
      let finalDate = `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
      req.utc = finalDate;
      req.unix = parseInt(req.params.date);
      next();
    } else {
      res.json({ error: "Invalid Date" });
    }
  },
  (req, res) => {
    res.json({ unix: req.unix, utc: req.utc });
  }
);

// listen for requests :)
var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
