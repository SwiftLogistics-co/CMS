const express = require("express");
require("dotenv").config();
const supabase = require("./supabaseClient");
const ordersRouter = require('./routes/orders');

const app = express();
app.use(express.json());

// // Example: Get all users from "profiles" table
// app.get("/profiles", async (req, res) => {
//   const { data, error } = await supabase.from("profiles").select("*");

//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// });

// // Example: Insert new row into "profiles"
// app.post("/profiles", async (req, res) => {
//   const { username, email } = req.body;
//   const { data, error } = await supabase.from("profiles").insert([{ username, email }]);

//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// });

app.use('/orders', ordersRouter);

app.get("/", async (req, res) => {
    res.send("Welcome to the CMS API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
