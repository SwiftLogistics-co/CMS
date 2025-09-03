const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Not logged in").end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  const { product, quantity, address, route_id } = req.body;
  const client_id = req.session.user.id;

  if (!product || !quantity) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Product and quantity are required").end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          client_id,
          address,
          route_id: route_id || null,
          product,
          quantity,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      const xml = builder.create("response")
        .ele("status", "fail").up()
        .ele("message", error.message).end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("message", "Order placed successfully").up()
      .ele("order")
        .ele("id", data.id).up()
        .ele("client_id", data.client_id).up()
        .ele("product", data.product).up()
        .ele("quantity", data.quantity).up()
        .ele("status", data.status).up()
        .ele("created_at", data.created_at).up()
      .end({ pretty: true });

    return res.type("application/xml").status(201).send(xml);
  } catch (err) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Server error").end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});

// Get all orders for logged-in user
router.get("/", async (req, res) => {
  if (!req.session.user) {
    const xml = builder.create("response")
      .ele("status", "fail").up()
      .ele("message", "Not logged in").end({ pretty: true });
    return res.type("application/xml").status(401).send(xml);
  }

  try {
    const userId = req.session.user.id;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("client_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", error.message).end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    const xml = builder.create("response")
      .ele("status", "success").up()
      .ele("orders");

    data.forEach(order => {
      const orderNode = xml.ele("order");
      orderNode.ele("id", order.id);
      orderNode.ele("product", order.product);
      orderNode.ele("quantity", order.quantity);
      orderNode.ele("status", order.status);
      orderNode.ele("address", order.address || "");
      orderNode.ele("route_id", order.route_id || "");
      orderNode.ele("created_at", order.created_at);
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
