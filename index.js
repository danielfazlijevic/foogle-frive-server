const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');

const app = express();

const models = require('./database/models');

const User = require('./database/models').User;


const authRoutes = require('./routes/auth.js');
const fileRoutes = require('./routes/files');

const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(passport.initialize());

app.get('/', function (req, res) {
  res.json({
    message: 'Express is up!'
  });
}); // start the app

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});





// models.sequelize.sync({ force: true }).then(result => {
//   // console.log(result);
//   app.listen(PORT, function () {
//     console.log(`Express is running on port ${PORT}`);
//   });
// }).catch(err => {
//   console.log(err);
// });


app.listen(PORT, function () {
  console.log(`Express is running on port ${PORT}`);
});