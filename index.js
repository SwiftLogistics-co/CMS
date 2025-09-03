const express = require("express");
const session = require("express-session");
const xmlparser = require('express-xml-bodyparser');
require("dotenv").config();

const ordersRouter = require('./routes/orders');
const authRoutes = require("./routes/auth");

const app = express();

// Use XML parser middleware
app.use(xmlparser({
  explicitArray: true,
}));


// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/orders', ordersRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
