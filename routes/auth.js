const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");
const router = express.Router();

// --------------------- LOGIN (POST) ---------------------
router.post("/login", async (req, res) => {
  if (!req.is("application/xml")) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Content-Type must be application/xml")
      .end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  try {
    const email = req.body.login?.email?.[0];
    const password = req.body.login?.password?.[0];

    if (!email || !password) {
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", "Email and password required")
        .end({ pretty: true });
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
        .ele("message", "Invalid email or password")
        .end({ pretty: true });
      return res.type("application/xml").status(401).send(xml);
    }

    // Save session data
    req.session.user = { 
      id: data.id, 
      email: data.email,
      loggedInAt: new Date().toISOString()
    };

    // Save session explicitly and then send response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        const xml = builder.create("response")
          .ele("status", "error").up()
          .ele("message", "Server error during session creation")
          .end({ pretty: true });
        return res.type("application/xml").status(500).send(xml);
      }

      const xml = builder.create("response")
        .ele("status", "success").up()
        .ele("message", "Login successful").up()
        .ele("user")
          .ele("id", data.id).up()
          .ele("email", data.email).up()
        .ele("sessionToken", req.sessionID).up()
        .end({ pretty: true });

      return res.type("application/xml").status(200).send(xml);
    });

  } catch (err) {
    console.error("Login error:", err);
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Server error during login")
      .end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});

// --------------------- CHECK LOGIN STATUS (GET) ---------------------
router.get("/login", (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Not logged in")
      .end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  const xml = builder.create("response")
    .ele("status", "success").up()
    .ele("message", "User profile").up()
    .ele("user")
      .ele("id", req.session.user.id).up()
      .ele("email", req.session.user.email).up()
      .ele("loggedInAt", req.session.user.loggedInAt).up()
    .end({ pretty: true });

  return res.type("application/xml").status(200).send(xml);
});

// --------------------- LOGOUT ---------------------
router.post("/logout", (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "No active session")
      .end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", "Failed to log out")
        .end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    // Clear session cookie
    res.clearCookie("cms.sid");
    
    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Logged out successfully")
      .end({ pretty: true });
    return res.type("application/xml").status(200).send(xml);
  });
});

module.exports = router;