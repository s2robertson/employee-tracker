const mysql = require('mysql2/promise');
const { DepartmentResultSet, RoleResultSet, EmployeeResultSet } = require('./resultSet');

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

        async deleteDepartment(deptId) {
            try {
                const [result] = await conn.execute('DELETE FROM department WHERE id = ?', [deptId]);
                return result.affectedRows > 0;
            } catch (err) {
                return false;
            }
        },

        async viewDepartmentBudgetUtilization(deptId) {
            const query = 'SELECT SUM(r.salary) AS total FROM role r INNER JOIN employee e ON e.role_id = r.id '
                + 'INNER JOIN department d ON r.department_id = d.id WHERE d.id = ?';
            const [rows] = await conn.execute(query, [deptId]);
            // if no employees match the query, it will still return a row with total = null
            if (rows.length > 0 && rows[0].total !== null) {
                return rows[0].total;
            }
            return 0;
        },

        async readRoles() {
            const query = 'SELECT r.id, r.title, d.name AS department, r.salary FROM role r '
                + 'INNER JOIN department d ON r.department_id = d.id'
            const [rows, fields] = await conn.query(query);
            const rs = new RoleResultSet(rows, fields);
            return rs;
        },

        async insertRole(title, salary, departmentId) {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const [result] = await conn.execute(query, [title, salary, departmentId]);
            return result.affectedRows > 0;
        },

        async deleteRole(roleId) {
            try {
                const [result] = await conn.execute('DELETE FROM role WHERE id = ?', [roleId]);
                return result.affectedRows > 0;
            } catch (err) {
                // the query throws if the role is actively being used by employees
                return false;
            }
        },

        async readEmployees({ departmentId, managerId } = {}) {
            let whereClause = '';
            let params = [];
            if (departmentId) {
                whereClause = ' WHERE d.id = ?';
                params.push(departmentId);
            }
            if (managerId !== undefined) {
                if (!whereClause) {
                    whereClause = ' WHERE ';
                } else {
                    whereClause += ' AND ';
                }
                if (managerId !== null) {
                    whereClause += 'manager.id = ?';
                    params.push(managerId);
                } else {
                    whereClause += 'manager.id IS NULL';
                }
            }
            
            const query = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, '
                + 'CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee e '
                + 'LEFT JOIN employee manager ON e.manager_id = manager.id '
                + 'INNER JOIN role r ON e.role_id = r.id '
                + 'INNER JOIN department d ON r.department_id = d.id'
                + whereClause;
            const [rows, fields] = await conn.execute(query, params);
            const rs = new EmployeeResultSet(rows, fields);
            return rs;
        },

        // this is a simpler version of readEmployees for when you only need the names and id
        async readEmployeeNames() {
            const query = 'SELECT id, first_name, last_name FROM employee';
            const [rows, fields] = await conn.query(query);
            const rs = new EmployeeResultSet(rows, fields);
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

        async updateEmployeeManager(employeeId, managerId) {
            const [result] = await conn.execute('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
            return result.affectedRows > 0;
        },

        async deleteEmployee(employeeId) {
            try {
                const [result] = await conn.execute('DELETE FROM employee WHERE id = ?', [employeeId]);
                return result.affectedRows > 0;
            } catch (err) {
                return false;
            }
        },

        close() {
            return conn.end();
        }
    }
})();