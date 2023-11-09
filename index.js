const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
// const csrf = require('csurf')
const csrf = require("csurf");
const User = require("./models/User");
require("dotenv").config();
require("./dataBAse/db");

const app = express();
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    name: "scret-name-asdasdasd",
  })
);
app.use(flash());


app.use((req, res, next) => {
  // DEPRECADO !!!!
  // res.locals.csrfToken = req.csrfToken();
  res.locals.mensajes = req.flash('mensajes')
  next();
});
// app.use(csrf());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, { id: user._id, userName: user.userName });
});
passport.deserializeUser(async (user, done) => {
  const userDB = await User.findById(user.id);
  return done(null, { id: userDB._id, userName: userDB.userName });
});
app.get;

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(
    `El server esta escuchando en el pureto ${port} http://localhost:${port}`
  );
  console.log(`http://localhost:${port}/auth/register`);
});
