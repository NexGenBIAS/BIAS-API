const express = require("express");
const dotenv = require("dotenv");
const Generator = require("./generator");
const fs = require("fs");


const app = express();
dotenv.config();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(function (req, res, next) {


    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

const port = process.env.PORT;

app.get("/", (req, res) => {
 res.send("<h3> Assignment Buddy API <a href='https://github.com/ISenseAura/Assignment-Buddy-API/blob/main/README.md'> Documentation </a></h3>");
});

app.post("/api/generate", (req, res) => {
  let { subject, number, qs, download } = req.body;
  let assignment = new Generator(subject, number, (path) => {
    if (path.startsWith("-")) return res.status(500).send({success:false, data:path});
    if (download) {
      let pdfFile = fs.createReadStream(path);
      pdfFile.pipe(res);
      return;
    }

    res.send({ success: true, data: "Assignment created successfully" });
  });
  assignment.askQ(qs);
});

app.post("/api/download", (req, res) => {
  let { subject, number } = req.body;
  let path = `./documents/${subject}/${subject + number}.pdf`;
  let pdfFile = fs.createReadStream(path);
  pdfFile.on("error", (err) => {
    res.send({ success: false, data: "Assignment does not exist" });
    return;
  });
  pdfFile.pipe(res);
});

app.post("/api/totalassignments", (req, res) => {
  let subject = req.body.subject;
  let dir = fs.readdirSync("./documents/" + subject);
  res.send({success:true, data : "Total assignments : " + dir.length/2, total:dir.length/2})

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
