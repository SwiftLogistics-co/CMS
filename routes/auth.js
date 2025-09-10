const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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

    // Generate JWT token
    const token = jwt.sign(
      { id: data.id, email: data.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Login successful").up()
      .ele("user")
        .ele("id", data.id).up()
        .ele("email", data.email).up()
        .ele("name", data.name || "").up()
        .ele("role", data.role || "").up()

      .up()
      .ele("sessionToken", token)
      .end({ pretty: true });

    return res.type("application/xml").status(200).send(xml);

  } catch (err) {
    console.error("Login error:", err);
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Server error during login")
      .end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});

// --------------------- JWT Authentication Middleware ---------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Missing Bearer token")
      .end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const xml = builder.create("response")
        .ele("status", "fail").up()
        .ele("message", "Invalid or expired token")
        .end({ pretty: true });
      return res.type("application/xml").status(403).send(xml);
    }
    req.user = user; // attach user info to request
    next();
  });
}

// --------------------- CHECK LOGIN STATUS (GET) ---------------------
router.get("/login", authenticateToken, (req, res) => {
  const xml = builder.create("response")
    .ele("status", "success").up()
    .ele("message", "User profile").up()
    .ele("user")
      .ele("id", req.user.id).up()
      .ele("email", req.user.email).up()
    .end({ pretty: true });

  return res.type("application/xml").status(200).send(xml);
});

module.exports = router;
module.exports.authenticateToken = authenticateToken; // export middleware for other routes
