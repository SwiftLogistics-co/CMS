const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");

const router = express.Router();

// LOGIN endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Email and password required").end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Invalid email or password").end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  // Store user info in session
  req.session.user = {
    id: data.id,
    email: data.email
  };

  const xml = builder.create("response")
    .ele("status", "success").up()
    .ele("message", "Login successful").up()
    .ele("user")
      .ele("id", data.id).up()
      .ele("email", data.email).up()
    .end({ pretty: true });

  return res.type("application/xml").status(200).send(xml);
});

// Example: check if logged in
router.get("/profile", (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Not logged in").end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  const xml = builder.create("response")
    .ele("status", "success").up()
    .ele("message", "User profile").up()
    .ele("user")
      .ele("id", req.session.user.id).up()
      .ele("email", req.session.user.email).up()
    .end({ pretty: true });

  return res.type("application/xml").status(200).send(xml);
});

// Example: logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Logged out successfully").end({ pretty: true });
    res.type("application/xml").status(200).send(xml);
  });
});

module.exports = router;
