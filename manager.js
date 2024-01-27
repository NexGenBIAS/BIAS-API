/*
 *   This module is responsible for managing assigments, experiments, question banks of each subject and storing it in ``databases`` directory
 *   This module does NOT write pdf/md files, only JSON.
 */

const fs = require("fs");
const config = require("./config");

function Datify() {
    return Date().split(" ").slice(0, 3).join(" ").replace(" ", ", ");
  }

class Assignment {
  constructor(subjectPrefix, qs, number, given, submission, user) {
    this.subjectPrefix = subjectPrefix;
    this.qs = qs;
    this.number = number;
    this.givenOn = given ? given : Datify();
    this.submission = submission ? submission : "Unown";
    this.type = "";
    this.uploadedBy = user ? user : "Unown";
    this.path = `./documents/${this.subjectPrefix}/${
      this.subjectPrefix + this.number
    }.pdf`;
  }
}

class Experiment {
  constructor(subjectPrefix, aim, number, batch, given, submission, user) {
    this.subjectPrefix = subjectPrefix;
    this.aim = aim;
    this.number = number;
    this.givenOn = given ? given : Date();
    this.submission = submission ? submission : null;
    this.type = "exp";
    this.batch = batch ? batch : "All";
    this.uploadedBy = user ? user : "Unown";
    this.path = `./documents/${this.subjectPrefix}/${
      this.subjectPrefix + this.number + this.type + this.batch
    }.pdf`;
  }
}

class SubjectManager {
  constructor(subject) {
    this.subject = config.subjects[subject];
    this.subjectPrefix = subject;
    this.totalAssignments = 0;
    this.totalExperiments = 0;
    this.totalQuestionBanks = 0;

    this.assignments = {};
    this.experiments = {};
    this.questionbanks = {};

    this.__init__();
  }

  __init__() {
    try {
      let data = JSON.parse(fs.readFileSync("./databases/" + this.subjectPrefix + ".json"));
      if (data) {
        this.countTotal();
        console.log(data);
        this.assignments = data.assignments;
        this.experiments = data.experiments;
        this.questionbanks = data.questionbanks;
        this.__export__();
      }
    } catch (e) {
      this.countTotal();
      this.__export__();
    }
  }

  __export__() {
    fs.writeFileSync("./databases/" + this.subjectPrefix + ".json",JSON.stringify(this));
  }

  addAssignment( qs, number, given, submission, user) {
    let ass = new Assignment(this.subjectPrefix, qs, number, given, submission, user);
    this.assignments[number] = ass;
    this.__export__();
  }

  addExperiment( aim, number,batch, given, submission, user) {
    let exp = new Experiment(this.subjectPrefix, qs, number, batch, given, submission, user);
    this.experiments[number + batch] = exp;
    this.__export__();
  }

  getAssignment(number) {
    if(!number) throw Error("No number specified");
    if(!this.assignments[number]) throw Error("Assignment not found");
    return this.assignments[number];
  }

  getExperiment(number,batch) {
    if(!number || !batch) throw Error("Batch or number not specified");
    if(!config.batches.includes(batch)) throw Error("Invalid batch")
    if(!this.experiments[number + batch]) throw Error(`Experiment ${number} of Batch ${batch} not found`);
    return this.experiments[number];
  }

  countTotal() {
    let files = fs.readdirSync("./documents/" + this.subjectPrefix);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.includes("expb") && file.endsWith(".pdf"))
        this.totalExperiments += 1;
      if (file.includes("qb") && file.endsWith(".pdf"))
        this.totalQuestionBanks += 1;
      if (
        !file.includes("qb") &&
        !file.includes("expb") &&
        file.endsWith(".pdf")
      )
        this.totalAssignments += 1;
    }
  }
}


exports.SubjectManager = SubjectManager;