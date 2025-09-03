"# CMS" 


npm install express body-parser @supabase/supabase-js xmlbuilder
npm install express-session
npm install express-xml-bodyparser



//login
http://localhost:3000/auth/login(post)
Request
<login>
  <email>user@example.com</email>
  <password>mypassword</password>
</login>

Response
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
response
<?xml version="1.0"?>
<response>
    <status>success</status>
    <message>User profile</message>
    <user>
        <id>1</id>
        <email>driver1@swift.com</email>
    </user>
</response>



