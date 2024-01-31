import fetch from "node-fetch";
global.fetch = fetch;
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from 'dotenv'
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

async function run(query, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  if(query.toLowerCase().includes("differentiate") || query.toLowerCase().includes("differentiate")) query +="(10 points table)"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  process.stdout.write(text);
  process.exit(0);

}

/*
let argv = process.argv;
let query = process.argv[2];
let context = process.argv[3];

console.log(argv);
try {
run(query,context);
} catch (e) {
  process.stderr.write(e.message);
}
*/

process.stdin.on("data",(data) => {
  if(data.toString().startsWith("-")) {
   
    run(data.toString().replace("-"));
  }
 // process.stdout.write(data + "[ai.mj]")

})

