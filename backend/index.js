const express = require("express");
const app = express();
const dialogflow = require('dialogflow');

const cors = require("cors");
app.use(express.json()); //json stringify k liye
app.use(cors());

const bodyParser = require("body-parser")
app.use(bodyParser.json());

const port = 1234;

const path = require('path')
const clientpath = path.join(__dirname,'../frontend/dist')
app.use('/',express.static(clientpath))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
})


app.post("/send-msg", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);
    // Check if user_message is present in the req.body
    if (!req.body || !req.body.user_message) {
      console.error("Invalid request structure");
      res.status(400).send({ error: "Bad Request" });
      return;
    }
    const data = await runSample(req.body.user_message);
    console.log("Sent data:", data);
    // Backend
    console.log("Received user message:", req.body);
    res.send({ Reply: data });
  } catch (error) {
    console.error("Error handling user message:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

const { v4: uuidv4 } = require('uuid');
const sessionId = uuidv4();


const {
  google_client_email,
  google_private_key_id,
  google_project_id,
  df_private_key,
} = require('./devkey');


 const googleprojectId = google_project_id;



// import dialogflow from 'dialogflow';
// const { SessionsClient } = dialogflow;
/**
 * Send a query to the Dialogflow agent and return the query result.
 * @param {string} projectId The project to be used
 */
const credentials = {
  client_email: google_client_email,
  private_key: df_private_key,
  rivate_key_id: google_private_key_id,
};
async function runSample(user_message, projectId = google_project_id) {
  // A unique identifier for the given session
  const sessionId = uuidv4();
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    credentials,
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the Dialogflow agent
        text:user_message,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  try {
    const [response] = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = response.queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    return result.fulfillmentText;
  } catch (error) {
    console.error("Error during intent detection:", error);
  }
}
console.log(sessionId);
// Example usage
runSample();

app.listen(port, () => {
  console.log(`App Running on PORT ${port}`);
});

module.exports = app;