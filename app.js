const express = require('express');
const cors = require('cors');
const unirest = require("unirest");

const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, '/build')));

app.get('/api/:word', (req, res) => {
  const request = unirest("GET", "https://jisho.org/api/v1/search/words");
  request.query({ "keyword": req.params.word });
  request.end(function (response) {
    if (response.error) throw new Error(response.error);
    res.json(response.body || {});
  });
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname,'/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});
app.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});