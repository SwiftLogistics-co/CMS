# CMS API Documentation

This documentation explains how to set up and use the CMS API with XML requests and JWT authentication.

---

## Installation

Install the required packages:

```bash
npm install express body-parser @supabase/supabase-js xmlbuilder
npm install express-session
npm install express-xml-bodyparser
npm install jsonwebtoken
```

---

## API Endpoints and Examples

### 1. Login (POST)

**Endpoint:** `http://localhost:3000/auth/login`

**Request XML:**

```xml
<login>
  <email>user@example.com</email>
  <password>mypassword</password>
</login>
```

**Response XML:**

```xml
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>Login successful</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
    <sessionToken>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkcml2ZXIxQHN3aWZ0LmNvbSIsImlhdCI6MTc1NzIyNjg5OCwiZXhwIjoxNzU3MjMwNDk4fQ.Hwum1J25QGTaufQw1gbjCAWzrdUYyg9oHJP6i4ky5n0</sessionToken>
</response>
```

**Frontend Example:**

```javascript
const loginXML = `
<login>
  <email>user@example.com</email>
  <password>mypassword</password>
</login>
`;

fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/xml",
    "Accept": "application/xml"
  },
  body: loginXML
})
  .then(res => res.text())
  .then(xmlString => {
    console.log(xmlString);

    // Extract token (if returned)
    const tokenMatch = xmlString.match(/<token>(.*?)<\/token>/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (token) {
      localStorage.setItem("jwtToken", token);
      console.log("Token saved:", token);
    }
  })
  .catch(err => console.error("Login error:", err));
```

---

### 2. Get Logged-in User Profile (GET)

**Endpoint:** `http://localhost:3000/auth/login`

**Response XML:**

```xml
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>User profile</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
</response>
```

---

### 3. Get Orders (GET)

**Endpoint:** `http://localhost:3000/orders`

**Response XML:**

```xml
<?xml version="1.0"?>
<response>
    <status>success</status>
    <orders>
        <order>
            <id>2</id>
            <product>Shoes</product>
            <quantity>2</quantity>
            <status>pending</status>
            <address>123 Main St</address>
            <route_id/>
            <created_at>2025-09-03T18:20:35.479132</created_at>
        </order>
        <order>
            <id>1</id>
            <product>Shoes</product>
            <quantity>2</quantity>
            <status>pending</status>
            <address>123 Main St</address>
            <route_id>2</route_id>
            <created_at>2025-09-03T18:13:31.65724</created_at>
        </order>
    </orders>
</response>

```

### place order
``` xml
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>Order placed successfully</message>
    <order>
        <id>3</id>
        <client_id>1</client_id>
        <product>Example Product</product>
        <quantity>2</quantity>
        <status>pending</status>
        <address>123 Street, City</address>
        <route_id>5</route_id>
        <created_at>2025-09-03T21:17:51.543955</created_at>
    </order>
</response>


const orderXML = `
<order>
  <product>Laptop</product>
  <quantity>2</quantity>
  <address>123 Main St</address>
</order>
`;

fetch("http://localhost:3000/orders", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/xml",
    "Accept": "application/xml"
  },
  body: orderXML
})
  .then(res => res.text())
  .then(xmlString => console.log("Order created:", xmlString))
  .catch(err => console.error("Error creating order:", err));
```

---




### 4. Get Orders Driver (POST)

**Endpoint:** `http://localhost:3000/orders/orders`

**Request XML:**

```xml
<request>
  <driver_id>2</driver_id>
  <status>pending</status>
</request>
```

**Response XML:**

```xml
<?xml version="1.0"?>
<response>
    <driver_id>2</driver_id>
    <route_id>2</route_id>
    <status>pending</status>
    <orders>
        <order>
            <id>11</id>
            <client_id>1</client_id>
            <route_id>2</route_id>
            <product>Example Product</product>
            <quantity>2</quantity>
            <status>pending</status>
            <created_at>2025-09-09T07:18:11.251088</created_at>
            <address>123 Street, City</address>
            <coordinate>
              <lat>6.9271</lat>
              <lng>79.8612</lng>
            </coordinate>

        </order>
    </orders>
</response>
```


**End of Documentation**
