const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webext"
})

app.get('/', (re, res)=> {
    return res.json("backend");
})

app.get('/useraccount', (req, res)=>{
    const sql = "select * from useraccount";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/useraccount', async(req, res)=> {
    const {username, password, fullname, email} = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the username is already taken
    const checkUsernameQuery = "SELECT * FROM useraccount WHERE username = ?";
    db.query(checkUsernameQuery, [username], (err, result) => {
        if (err) {
            return res.json({ status: "error", message: "Database error." });
        }

        if (result.length > 0) {
            return res.json({ status: "error", message: "Username is already taken. Choose another one." });
        }

        // Insert the user data into the database
        const insertQuery = "INSERT INTO useraccount (username, password, fullname, email) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [username, hashedPassword, fullname, email], (err, result) => {
            if (err) {
                return res.json({ status: "error", message: "Database error." });
            }

            return res.json({ status: "success", message: "Signup successful!" });
        });
    });
})

app.listen(8081, ()=>{
    console.log('server works');
})