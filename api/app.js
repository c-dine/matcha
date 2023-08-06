const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// //
// var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "1234",
//   database: 'matcha',

// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

