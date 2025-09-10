const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// --------------------- LOGIN (POST) ---------------------

router.get("/routes", async (req, res) => {
  // const userId = req.user.id; // from JWT (not used here)
  try {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", error.message)
        .end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    const xml = builder.create("response")
      .ele("status", "success");

    // Each route as a separate <route> node
    const routesXml = xml.ele("routes");
    data.forEach(route => {
      const routeNode = routesXml.ele("route");
      routeNode.ele("id", route.id);
      routeNode.ele("route_name", route.route_name);
      routeNode.ele("driver_id", route.driver_id);
      routeNode.ele("start_location", route.start_location || "");
      routeNode.ele("end_location", route.end_location || "");
      routeNode.ele("created_at", route.created_at);
      // Add more route fields as needed
    });

    return res.type("application/xml").status(200).send(xml.end({ pretty: true }));

  } catch (err) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Server error").end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});



module.exports = router;
