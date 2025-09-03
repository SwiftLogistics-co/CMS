const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");
const xmlparser = require("express-xml-bodyparser");
const router = express.Router();

// --------------------- LOGIN ---------------------
// Login route (XML-only)
router.post("/login", xmlparser({ explicitArray: true }), async (req, res) => {
  // Reject non-XML requests
  if (!req.is("application/xml")) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Content-Type must be application/xml").end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  try {
    const email = req.body.login?.email?.[0];
    const password = req.body.login?.password?.[0];

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

    // Save session
    req.session.user = { id: data.id, email: data.email };

    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Login successful").up()
      .ele("user")
        .ele("id", data.id).up()
        .ele("email", data.email).up()
      .end({ pretty: true });

    return res.type("application/xml").status(200).send(xml);
  } catch (err) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Server error").end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});



// --------------------- PROFILE ---------------------
router.get("/login", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Not logged in").end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  // Return user profile in XML
  const xml = builder.create("response")
    .ele("status", "success").up()
    .ele("message", "User profile").up()
    .ele("user")
      .ele("id", req.session.user.id).up()
      .ele("email", req.session.user.email).up()
    .end({ pretty: true });

  return res.type("application/xml").status(200).send(xml);
});

// --------------------- LOGOUT ---------------------
router.post("/logout", (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "No active session").end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  // Destroy session
  req.session.destroy(err => {
    if (err) {
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", "Failed to log out").end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Logged out successfully").end({ pretty: true });
    return res.type("application/xml").status(200).send(xml);
  });
});


module.exports = router;
