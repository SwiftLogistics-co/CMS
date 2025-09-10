const express = require("express");
const supabase = require("../supabaseClient");
const builder = require("xmlbuilder");
const { authenticateToken } = require("./auth"); // JWT middleware

const router = express.Router();

// --------------------- CREATE ORDER ---------------------
router.post("/createOrder", authenticateToken, async (req, res) => {
  const product = req.body.order?.product?.[0];
  const quantity = req.body.order?.quantity?.[0];
  const address = req.body.order?.address?.[0];
  const route_id = req.body.order?.route_id?.[0];
  const client_id = req.user.id; // from JWT

  if (!product || !quantity) {
    const xml = builder.create("response")
      .ele("status", "error").up()
      .ele("message", "Product and quantity are required")
      .end({ pretty: true });
    return res.type("application/xml").status(400).send(xml);
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        client_id,
        address,
        route_id: route_id || null,
        product,
        quantity,
        status: "pending"
      }])
      .select()
      .single();

    if (error) {
      const xml = builder.create("response")
        .ele("status", "fail").up()
        .ele("message", error.message)
        .end({ pretty: true });
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
        .ele("address", data.address || "").up()
        .ele("route_id", data.route_id || "").up()
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

// --------------------- GET USER ORDERS ---------------------
router.get("/getByCustomer", authenticateToken, async (req, res) => {
  const userId = req.user.id; // from JWT

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("client_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      const xml = builder.create("response")
        .ele("status", "error").up()
        .ele("message", error.message)
        .end({ pretty: true });
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



// POST /getByDriver/:driver_id?status=pending
router.post("/getByDriver/:driver_id", authenticateToken, async (req, res) => {
  try {
    const driver_id_raw = req.params.driver_id;
    const status = req.query.status || undefined;

    if (!driver_id_raw) {
      const xml = builder
        .create("response")
        .ele("error", "driver_id is required")
        .end({ pretty: true });
      return res.type("application/xml").status(400).send(xml);
    }

    const driver_id = parseInt(driver_id_raw, 10);

    // Step 1: Get route_id for this driver
    const { data: driverData, error: driverError } = await supabase
      .from("routes")
      .select("id")
      .eq("driver_id", driver_id)
      .maybeSingle();

    if (driverError || !driverData) {
      const xml = builder
        .create("response")
        .ele("error", "Driver not found")
        .end({ pretty: true });
      return res.type("application/xml").status(404).send(xml);
    }

    const routeId = driverData.id;

    // Step 2: Get orders for this route
    let query = supabase.from("orders").select("*").eq("route_id", routeId);
    if (status) {
      query = query.eq("status", status);
    }
    const { data: ordersData, error: ordersError } = await query;

    if (ordersError) {
      const xml = builder
        .create("response")
        .ele("error", "Database error")
        .end({ pretty: true });
      return res.type("application/xml").status(500).send(xml);
    }

    // Step 3: Build XML response
    const xml = builder.create("response");
    xml.ele("driver_id", driver_id);
    xml.ele("route_id", routeId);
    xml.ele("status", status || "ALL");

    const ordersXml = xml.ele("orders");
    if (!ordersData || ordersData.length === 0) {
      ordersXml.ele("message", "No orders found");
    } else {
      ordersData.forEach((order) => {
        const orderNode = ordersXml.ele("order");
        orderNode.ele("id", order.id);
        orderNode.ele("client_id", order.client_id);
        orderNode.ele("route_id", order.route_id);
        orderNode.ele("product", order.product);
        orderNode.ele("quantity", order.quantity);
        orderNode.ele("status", order.status);
        orderNode.ele("created_at", order.created_at);
        orderNode.ele("address", order.address || "");
        // If coordinate data is available, add it
        if (order.coordinate && Array.isArray(order.coordinate) && order.coordinate.length === 2) {
          const coordinateNode = orderNode.ele("coordinate");
          coordinateNode.ele("lat", order.coordinate[0]);
          coordinateNode.ele("lng", order.coordinate[1]);
        }
      });
    }

    return res.type("application/xml").send(xml.end({ pretty: true }));

  } catch (err) {
    const xml = builder
      .create("response")
      .ele("error", "Unexpected server error")
      .end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});


// --------------------- MOCK Orders ENDPOINT for Route optimize ---------------------
router.get("/mock/driver/routes", async (req, res) => {
  try {
    // Mock data array
    const mockOrders = [
      {
        order_id: "3",
        address: "789 Kandy Road, Kadawatha", 
        coordinate: [7.0078, 79.9553]
      },
      {
        order_id: "1",
        address: "123 Main Street, Colombo 01",
        coordinate: [6.9271, 79.8612]
      },
      {
        order_id: "2", 
        address: "456 Galle Road, Mount Lavinia",
        coordinate: [6.8389, 79.8653]
      },
      {
        order_id: "4",
        address: "321 Negombo Road, Ja-Ela",
        coordinate: [7.0744, 79.8947]
      },
      {
        order_id: "5",
        address: "654 High Level Road, Nugegoda",
        coordinate: [6.8649, 79.8997]
      }
    ];

    // Build XML response
    const xml = builder.create("response");
    xml.ele("status", "success");
    
    const ordersXml = xml.ele("orders");
    
    mockOrders.forEach((order) => {
      const orderNode = ordersXml.ele("order");
      orderNode.ele("order_id", order.order_id);
      orderNode.ele("address", order.address);
      
      const coordinateNode = orderNode.ele("coordinate");
      coordinateNode.ele("lat", order.coordinate[0]);
      coordinateNode.ele("lng", order.coordinate[1]);
    });

    return res.type("application/xml").status(200).send(xml.end({ pretty: true }));

  } catch (err) {
    console.error("Mock endpoint error:", err);
    const xml = builder
      .create("response")
      .ele("status", "error")
      .up()
      .ele("message", "Server error")
      .end({ pretty: true });
    return res.type("application/xml").status(500).send(xml);
  }
});

// responce exmple
/*
<?xml version="1.0"?>
<response>
  <status>success</status>
  <orders>
    <order>
      <order_id>1</order_id>
      <address>123 Main Street, Colombo 01</address>
      <coordinate>
        <lat>6.9271</lat>
        <lng>79.8612</lng>
      </coordinate>
    </order>
    <order>
      <order_id>2</order_id>
      <address>456 Galle Road, Mount Lavinia</address>
      <coordinate>
        <lat>6.8389</lat>
        <lng>79.8653</lng>
      </coordinate>
    </order>
    <!-- ... more orders ... -->
  </orders>
</response>
*/

module.exports = router;
