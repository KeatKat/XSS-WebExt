const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const user = require("./user");
const { createUser, getUserByUsername, getAllUsers } = require("./controller");
const jsonwebtoken = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
  }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webext"
});

app.get('/', (req, res) => {
    return res.json("backend");
});

app.get('/useraccount', (req, res) => {
    const sql = "select * from useraccount";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/signup', async (req, res) => {
    const { username, password, fullname, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the username is already taken
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.json({ status: "error", message: "Username is already taken. Choose another one." });
        }

        // Insert the user data into the database
        createUser(username, hashedPassword, fullname, email);

        return res.json({ status: "success", message: "Signup successful!" });
    } catch (error) {
        return res.json({ status: "error", message: "Database error." });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username exists
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.json({ status: "error", message: "Invalid username or password." });
        }

        // Compare the provided password with the hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.json({ status: "error", message: "Invalid username or password." });
        }

        const authToken = jsonwebtoken.sign({ username, password }, "DUMMYKEY");
        res.cookie("authToken", authToken, {
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json({ user, status: "success", message: "Login successful!" });
    } catch (error) {
        return res.json({ status: "error", message: "Database error." });
    }
});

app.get('/auto-login', async (req, res) => {
    const authToken = req.cookies.authToken;

    if (!authToken) {
        return res.sendStatus(401);
    }

    //const authToken = cookie['authToken']

    try {
        const decoded = jsonwebtoken.verify(authToken, "DUMMYKEY");
        //const { username, password } = decoded;
        const user = await getUserByUsername(decoded.username);
        const { username, fullname, email } = user;
        

        console.log("User ID:", username);
        //console.log("User Password:", password);
    
        return res.json({user: { username, fullname, email }, status: "success", message: "Login successful!"});
      } catch (error) {
        // If there's an error decoding the JWT, it might be expired or tampered with
        console.error("Error decoding authToken:", error);
        return res.sendStatus(401);
      }
});

app.get("/logout", (req, res) => {
    res.clearCookie("authToken");
    return res.sendStatus(200);
});
  

app.listen(8081, () => {
    console.log('server works');
});
