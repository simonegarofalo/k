const express = require('express');
const session = require('express-session');
const authRoutes = require("./routes/auth");
const linksRouter = require('./routes/links');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/app.html'));
});


app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    name: "kangaroo.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true only in HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use('/api/links', linksRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
