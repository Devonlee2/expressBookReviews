const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const SECRET_KEY = "fingerprint_customer";

app.use(express.json());

app.use("/customer", session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.token) {
        jwt.verify(req.session.token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Unauthorized access" });
            }
            req.user = decoded; // Store decoded user info for further use
            next();
        });
    } else {
        return res.status(401).json({ message: "Access token missing. Please log in." });
    }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
