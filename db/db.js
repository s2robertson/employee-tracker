const mysql = require('mysql2/promise');

module.exports = (async function() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'employee_tracker_db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    return {
        async readDepartments() {
            const [results, fields] = await conn.query('SELECT * FROM department');
            console.log(results);
            console.log(fields);
        },

        async readRoles() {
            const [results, fields] = await conn.query('SELECT * FROM role');
            console.log(results);
            console.log(fields);
        },

        async readEmployees() {
            const [results, fields] = await conn.query('SELECT * FROM employee');
            console.log(results);
            console.log(fields);
        },

        close() {
            return conn.end();
        }
    }
})();