const express = require("express");
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors'); // Added CORS
require("dotenv").config();

const ordersRouter = require('./routes/orders');
const authRoutes = require("./routes/auth");
const routesRoutes = require("./routes/routes");

const app = express();

app.use(cors()); // Allow all CORS
// XML body parser
app.use(xmlparser({ explicitArray: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/orders', ordersRouter);
app.use("/routes", routesRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
