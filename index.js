const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const db = require("./db");
const mongoose = require("mongoose");

const app = express();

db.connect(app);

app.use(cors({ origin: "http://localhost:8000", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 1;

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
  },
  collectionName: "sessions",
  mongooseConnection: mongoose.connection,
});

app.use(
  session({
    secret: "!LxZuEjPn@7TcSbGwD8QyfHkVtN4$#A9s",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    },
    store: sessionStore,
  })
);

require("./routes")(app);

const port = 3000;

// app.use((req, res, next) => {
//   if (req.session.isNew) {
//     console.log("New session created");
//   } else {
//     console.log("Existing session found");
//   }
//   next();
// });

app.on("ready", () => {
  app.listen(port, () => {
    console.log("Server is up on port", 3000);
  });
});
