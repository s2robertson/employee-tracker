const mysql = require('mysql2/promise');
const { ResultSet, DepartmentResultSet } = require('./resultSet');

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
            const rs = new DepartmentResultSet(rows, fields);
            return rs;
        },

        async insertDepartment(deptName) {
            const [result] = await conn.execute('INSERT INTO department (name) VALUES (?)', [deptName]);
            // could also return insertId
            return result.affectedRows > 0;
        },

        async readRoles() {
            const query = 'SELECT r.id, r.title, d.name AS department, r.salary FROM role r '
                + 'INNER JOIN department d ON r.department_id = d.id'
            const [rows, fields] = await conn.query(query);
            const rs = new ResultSet(rows, fields);
            return rs;
        },

        async insertRole(title, salary, departmentId) {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const [result] = await conn.execute(query, [title, salary, departmentId]);
            return result.affectedRows > 0;
        },

        async readEmployees() {
            const query = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, '
                + 'CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee e '
                + 'LEFT JOIN employee manager ON e.manager_id = manager.id '
                + 'INNER JOIN role r ON e.role_id = r.id '
                + 'INNER JOIN department d ON r.department_id = d.id';
            const [rows, fields] = await conn.query(query);
            const rs = new ResultSet(rows, fields);
            return rs;
        },

        async insertEmployee(firstName, lastName, roleId, managerId) {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const [result] = await conn.execute(query, [firstName, lastName, roleId, managerId]);
            return result.affectedRows > 0;
        },

        async updateEmployeeRole(employeeId, roleId) {
            const [result] = await conn.execute('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
            return result.affectedRows > 0;
        },

        close() {
            return conn.end();
        }
    }
})();