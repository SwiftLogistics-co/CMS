const express = require("express");
const session = require("express-session");
require("dotenv").config();



// const supabase = require("./supabaseClient");
const ordersRouter = require('./routes/orders');
const authRoutes = require("./routes/auth");


const app = express();
app.use(express.json());

//Setup session
app.use(
  session({
    secret: "supersecretkey",  // change this to something secure
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // true only if HTTPS
  })
);

app.use('/auth', authRoutes);
app.use('/orders', ordersRouter);

app.get("/", async (req, res) => {
    res.send("Welcome to the CMS API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
