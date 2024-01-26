// specifically for CSE TY
let fs = require("fs");
let { spawn } = require("child_process");
const { mdToPdf } = require("md-to-pdf");
const { mkdir } = require("fs").promises;

let subjects = {
  bis: "Business Intelligence System",
  cns: "Cryptography Network Security",
  dt: "Design Thinking",
  nlp: "Natural Language Processing",
  misc: "Miscellaneous",
};

let note =
  "Note : this document was generated by an AI and is not approved by any faculty from our college";

let website = ` \n\n\n\n<br> <hr> <br> <p align="center"> By <a href="http://13.201.97.22:4000/" style="text-decoration:none;"> Assignment Buddy </a> </p>`;

Object.keys(subjects).forEach(async (sub) => {
  try {
    await mkdir("./documents/" + sub);
    console.log(`${sub} directory created successfully`);
  } catch (e) {
    console.log(`${sub} directory already exists`);
  }
});

let toPDF = async (path, cb) => {
  const pdf = await mdToPdf({ path: path }).catch(console.error);

  if (pdf) {
    fs.writeFileSync(path.replace(".md", ".pdf"), pdf.content);
    cb(path.replace(".md", ".pdf"));
    console.log("Done...")
  } else {
    cb("-Error could not write PDF");
  }
};

function Datify() {
  return Date().split(" ").slice(0, 3).join(" ").replace(" ", ", ");
}

//console.log(Datify());

let heading = (title, number) => {
  let text = `<span style='color:red'><i> (${note}) </i> <br> <span style="color:green;"> </span> </span> \n \n # Assignment ${number}\n **Class** : CSE TY <br>**Subject** : ${title} <br>**Generated On** : ${Datify()}  \n <hr> \n\n`;
  return text;
};

class Generator {
  constructor(subject, number, cb) {
    this.subject = subject ? subjects[subject] : "_";
    this.number = number;
    this.subjectPrefix = subject;
    this.year = 3;
    // this.extra = extra ? extra : "BTech";
    this.c = 0;
    this.path = `./documents/${this.subjectPrefix}/${
      this.subjectPrefix + this.number
    }.md`;

    this.readMeStream = fs.createWriteStream(this.path);
    this.readMeStream.write(heading(this.subject, this.number));
    this.callback = cb;
  }

  askQ(qs) {
    if(!subjects[this.subjectPrefix]) throw Error("ERROR :  Invalid subject prefix");
    console.log("Generating Answer...");
    this.AIStream = spawn("node", ["ai.mjs"]);
    this.AIStream.on("error", (e) => console.log(e));
    this.readMeStream.write(
      ` \n\n #### Q${this.c + 1}. ${qs[this.c]} \n\n #### Ans. <br> \n`
    );
    this.AIStream.stderr.on("data", (err) => console.log(err.toString()));
    this.AIStream.stdin.write("-" + qs[this.c]);

    this.AIStream.stdout.on("data", (data) => {
      this.readMeStream.write(data);
    });
    this.AIStream.stdout.on("end", () => {
      console.log("Done...");
      this.c += 1;
      if (qs[this.c]) {
        this.AIStream.kill();
        this.AIStream = null;
        this.askQ(qs);
      } else {
        this.readMeStream.write(` <i>${website} </i>`);
        this.readMeStream.end();
        console.log("Converting to PDF...");
        toPDF(this.path, this.callback);
      }
    });
  }
}

module.exports = Generator;

/*

let qs = [
  "What is a Cloud and explain Software as a Service (SaaS) in detail.",
  "Define ETL process and explain in detail with architecture. Support your answer with a diagram.",
  "Write a short note on: a. BI tools b. Types of users",
];

BIS.askQ(qs);*/
