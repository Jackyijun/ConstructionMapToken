// require('dotenv').config(); // To use environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const fetch = require('node-fetch'); // To make HTTP requests
const cors = require('cors'); // Import the cors package


const app = express();
const port = 3000; // You can choose any available port

// Use the cors middleware
app.use(cors());

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log(CLIENT_ID);

app.get('/generateToken', async (req, res) => {
  try {
    const token = await generateToken(CLIENT_ID, CLIENT_SECRET);
    console.log(token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function generateToken(clientId, clientSecret) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');
  params.append('expiration', 1440); // Token expiration time in minutes (optional)
  params.append('f', 'json');

  const response = await fetch('https://www.arcgis.com/sharing/rest/oauth2/token', {
    method: 'POST',
    body: params
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.access_token;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
