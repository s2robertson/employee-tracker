const mysql = require('mysql2/promise');
const ResultSet = require('./resultSet');

module.exports = (async function() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'employee_tracker_db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    return {
        async readDepartments() {
            const [rows, fields] = await conn.query('SELECT * FROM department');
            const rs = new ResultSet(rows, fields);
            console.log(rs.toString());
        },

        async readRoles() {
            const [rows, fields] = await conn.query('SELECT * FROM role');
            const rs = new ResultSet(rows, fields);
            console.log(rs.toString());
        },

        async readEmployees() {
            const [rows, fields] = await conn.query('SELECT * FROM employee');
            const rs = new ResultSet(rows, fields);
            console.log(rs.toString());
        },

        close() {
            return conn.end();
        }
    }
})();