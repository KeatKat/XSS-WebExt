const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

// Function to create a new user
const createUser = (username, password, fullname, email) => {
    const insertQuery = "INSERT INTO useraccount (username, password, fullname, email) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [username, password, fullname, email], (err, result) => {
        if (err) {
            console.error("Error creating user:", err);
        }
    });
};

// Function to get a user by username
const getUserByUsername = (username) => {
    const checkUserQuery = "SELECT * FROM useraccount WHERE username = ?";
    // Assuming you use a promise-based approach or callbacks to handle asynchronous queries
    return new Promise((resolve, reject) => {
        db.query(checkUserQuery, [username], (err, result) => {
            if (err) {
                console.error("Error getting user by username:", err);
                reject(err);
            } else {
                resolve(result[0]); // Assuming the result is an array, return the first user found
            }
        });
    });
};

// Function to get all users (placeholder, adjust as needed)
const getAllUsers = () => {
    const sql = "SELECT * FROM useraccount";
    // Assuming you use a promise-based approach or callbacks to handle asynchronous queries
    return new Promise((resolve, reject) => {
        db.query(sql, (err, data) => {
            if (err) {
                console.error("Error getting all users:", err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = { createUser, getUserByUsername, getAllUsers };
