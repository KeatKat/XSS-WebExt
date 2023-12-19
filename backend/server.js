const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const user = require("./user");
const { createUser, getUserByUsername, getAllUsers } = require("./controller");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
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

        return res.json({ user, status: "success", message: "Login successful!" });
    } catch (error) {
        return res.json({ status: "error", message: "Database error." });
    }
});

app.listen(8081, () => {
    console.log('server works');
});
