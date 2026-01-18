const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()

app.use(cors());
app.use(express.json());

const db = require("./src/config/db")

db.query("SELECT 2")
  .then(response => {
    console.log("Połączono z bazą. Response:", response.rows || response);
  })
  .catch(error => {
    console.error("Błąd połączenia z DB:", error.message);
  });

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});