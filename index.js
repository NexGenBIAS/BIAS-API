const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

require("./globals");

global.Tools = require("js-helpertools");
let Tools = require("js-helpertools");

const config = require("./config")
global.config = config;

const Generator = require("./generator");
const fs = require("fs");

const { SubjectManager } = require("./manager")





const app = express();


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

let getUptime = () => {
  let uptime = process.uptime();
		let uptimeText;
		if (uptime > 24 * 60 * 60) {
			let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			let uptimeHours= Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = Tools.toDurationString(uptime * 1000);
		}
    return uptimeText;
}

app.get("/", (req, res) => {
 res.send(`<h3> Assignment Buddy API <a href='https://github.com/ISenseAura/Assignment-Buddy-API/blob/main/README.md'> Documentation </a> <br><br> <small> Uptime : ${getUptime()}</h3>`);
});

app.post("/api/generate", (req, res) => {
  let { subject, number, qs, download, username, authKey, type } = req.body;

  if(!username) return res.send({success : false, data : "Invalid user session"})
  if(!config.subjects[subject]) return res.send({success : false, data:"Invalid subject"});
  if(typeof parseInt(number) != typeof 5) return res.send({success : false, data : "The number parameter must only contain numbers"})
  if(typeof qs != typeof []) return res.send({success : false, data : "Invalid array of questions"});
  if(!qs.length) return res.send({success : false, data : "Received empty array of questions"});

  let assignment = new Generator(subject, number,type, (path,temp) => {
    if (path.startsWith("-")) return res.status(500).send({success:false, data:path});
    if (download) {
      let pdfFile = fs.createReadStream(path);
      pdfFile.pipe(res);
      return;
    }

    if(config.hasAccess(authKey,username)) {
      let manager = new SubjectManager(subject);
      manager.addAssignment(qs,number,false,false,username);
      delete manager;
    }

    res.send({ success: true, data: "Assignment created successfully", temp : temp });
  });
  try {
  assignment.askQ(qs,authKey,username);
  } catch(e) {
    res.send({success : false, data : e.message})
  }
});


app.get("/api/download/:subject/:number", (req, res) => {
  let { subject, number } = req.params;
  let path = `./documents/${subject}/${subject + number}.pdf`;
  let pdfFile = fs.createReadStream(path);
  pdfFile.on("error", (err) => {
    res.send({ success: false, data: "Assignment does not exist" });
    return;
  });
  res.download(path);
 // pdfFile.pipe(res);
  
});

app.get("/api/details/:subject", (req, res) => {
  let { subject } = req.params;
  if(!config.subjects[subject]) return res.send({success:false, data : "Invalid subject"})
  let details = new SubjectManager(subject);

  res.send({success : true, data : details})
  delete details;
  console.log(details);

  // pdfFile.pipe(res);
  
});

app.get("/api/view/:subject/:number", (req, res) => {
  let { subject, number } = req.params;
  let path = `./documents/${subject}/${subject + number}.pdf`;
  let pdfFile = fs.createReadStream(path);
  pdfFile.on("error", (err) => {
    res.send({ success: false, data: "Assignment does not exist" });
    return;
  });
  //res.download(path);
  pdfFile.pipe(res);
  
});



app.post("/api/download", (req, res) => {
  let { subject, number } = req.body;
  let path = `./documents/${subject}/${subject + number}.pdf`;
  let pdfFile = fs.createReadStream(path);
  pdfFile.on("error", (err) => {
    res.send({ success: false, data: "Assignment does not exist" });
    return;
  });

  //let file = fs.readFileSync(path);
  res.set({
    'Content-Disposition': `attachment; filename='${"fileName"}'`,
    'Content-Type': 'application/octet-stream',
  });
  pdfFile.pipe(res);

 /*

  pdfFile.pipe(res);
  */
});

app.post("/api/totalassignments", (req, res) => {
  let subject = req.body.subject;
  let dir = fs.readdirSync("./documents/" + subject);
  res.send({success:true, data : "Total assignments : " + dir.length/2, total:dir.length/2})

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
