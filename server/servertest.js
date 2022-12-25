const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log(req.body);
  const { prompt } = req.body;

  // Generate a response based on the user's prompt
  const response = generateResponse(prompt);

  // Send the response back to the client
  res.json({ bot: response });
});

app.listen(5000, () => console.log('Server running on port 5000'));

function generateResponse(prompt) {
  // Placeholder logic for generating a response
  if (prompt.includes('hello')) {
    return 'Hello! How can I help you today?';
  } else {
    return 'I\'m sorry, I didn\'t understand your message. Could you please rephrase it?';
  }
}
