const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

absolutePath = __dirname + "/views/index.html";
app.get("/", (req, res) => {
  res.sendFile(absolutePath);
});

app.use(express.static(__dirname + "/public"));

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
  "/api/:word",
  (req, res, next) => {
    if (req.params.word.includes("-")) {
      let dateString = req.params.word.toString();
      req.unix = parseInt(new Date(dateString).getTime());
      req.utc = new Date(dateString).toUTCString();
      next();
    } else {
      let dateInt = parseInt(req.params.word);
      let dateObj = new Date(dateInt);
      let dayy = dateObj.getUTCDay();
      let day = DAYS[dayy];
      let date = dateObj.getUTCDate();
      let monthh = dateObj.getUTCMonth();
      let month = MONTHS[monthh];
      let year = dateObj.getUTCFullYear();
      let hours = dateObj.getUTCHours();
      let minutes = dateObj.getUTCMinutes();
      let seconds = dateObj.getUTCSeconds();
      let finalDate = `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
      req.utc = finalDate;
      req.unix = parseInt(req.params.word);
      next();
    }
  },
  (req, res) => {
    res.json({ unix: req.unix, utc: req.utc });
  },
);

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
