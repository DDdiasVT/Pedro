
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI("AIzaSyCX54Df_hJ9mjj-aHVkWLT_QFjosev6d2k");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash!");
  } catch (e) {
    console.log("Error with gemini-1.5-flash:", e.message);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      await model.generateContent("test");
      console.log("Success with gemini-pro!");
    } catch (e2) {
      console.log("Error with gemini-pro:", e2.message);
    }
  }
}

listModels();
