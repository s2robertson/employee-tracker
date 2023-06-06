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
            const query = 'SELECT r.id, r.title, d.name AS department, r.salary FROM role r '
                + 'INNER JOIN department d ON r.department_id = d.id'
            const [rows, fields] = await conn.query(query);
            const rs = new ResultSet(rows, fields);
            console.log(rs.toString());
        },

        async readEmployees() {
            const query = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary FROM employee e '
                + 'INNER JOIN role r ON e.role_id = r.id '
                + 'INNER JOIN department d ON r.department_id = d.id';
            const [rows, fields] = await conn.query(query);
            const rs = new ResultSet(rows, fields);
            console.log(rs.toString());
        },

        close() {
            return conn.end();
        }
    }
})();