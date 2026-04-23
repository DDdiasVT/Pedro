
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
  const genAI = new GoogleGenerativeAI("AIzaSyCX54Df_hJ9mjj-aHVkWLT_QFjosev6d2k");
  try {
    // There is no listModels in the SDK easily available like this, 
    // but we can try to fetch a known list or just use a different approach.
    // Actually, the SDK doesn't expose listModels directly in a simple way in some versions.
    // Let's try to use the REST API via fetch.
    const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCX54Df_hJ9mjj-aHVkWLT_QFjosev6d2k";
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Error listing models:", e.message);
  }
}

list();
