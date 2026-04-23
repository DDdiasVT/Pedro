
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCX54Df_hJ9mjj-aHVkWLT_QFjosev6d2k";
    const res = await fetch(url);
    const data = await res.json();
    const available = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);
    console.log("Top available models:", available.slice(0, 15));
  } catch (e) {
    console.log("Error:", e.message);
  }
}

list();
