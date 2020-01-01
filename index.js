const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');
const cors = require('cors');

const app = express();

const User = require('./database/models').User;
const Link = require('./database/models').Link;


const authRoutes = require('./routes/auth.js');
const fileRoutes = require('./routes/files');
const sharedFilesRoutes = require('./routes/shared');

const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

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
app.use('/shared', sharedFilesRoutes);

app.get('/users', async (req, res) => {
  const users = await User.findAll({
    include: [{model: Link, as: "AccessTo"}]
  });
  res.json(users);
});

/* USED FOR FORCING SYNC WITH DATABASE -> DELETES EVERYTHING FROM THE DATABASE */
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