"# CMS" 


npm install express body-parser @supabase/supabase-js xmlbuilder
npm install express-session
npm install express-xml-bodyparser



//login
http://localhost:3000/auth/login(post)
<!-- Request -->
<login>
  <email>user@example.com</email>
  <password>mypassword</password>
</login>

<!-- Response -->
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>Login successful</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
</response>



login(get)
<!-- response -->
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>User profile</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
</response>


<!-- get order -->
<!-- http://localhost:3000/orders(get) -->
<!-- response -->
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



