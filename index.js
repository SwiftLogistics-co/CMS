const express = require("express");
const session = require("express-session");
const xmlparser = require('express-xml-bodyparser');
require("dotenv").config();

const ordersRouter = require('./routes/orders');
const authRoutes = require("./routes/auth");

const app = express();


app.use(xmlparser({
  explicitArray: true,
}));


app.use(session({
  name: "cms.sid", // must match what you clear on logout
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
}));


// Routes
app.use('/auth', authRoutes);
app.use('/orders', ordersRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
