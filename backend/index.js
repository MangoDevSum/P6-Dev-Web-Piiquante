const express = require('express');
const mongoose = require('mongoose');

const PORT_BACKEND = 3000;
const PORT_MONGODB = 27017;

const app = express()

app.get('/', async (req, res) => {
  await mongoose.connect(`mongodb://localhost:${PORT_MONGODB}/test`);
  res.send('Hello World!');
})

console.log(`Listening at http://localhost:${PORT_BACKEND}/`);
app.listen(PORT_BACKEND)
