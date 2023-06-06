require('dotenv').config();
const inquirer = require('inquirer');

(async function() {
    const db = await require('./db/db');

    const {
        viewDepartments,
        addDepartment,
        deleteDepartment
    } = require('./cli/departments');
    
    const {
        viewRoles,
        addRole,
        deleteRole
    } = require('./cli/roles');

    const {
        viewEmployees,
        viewEmployeesByManager,
        viewEmployeesByDepartment,
        addEmployee,
        updateEmployeeRole,
        updateEmployeeManager,
        deleteEmployee
    } = require('./cli/employees');

    async function exit(db) {
        await db.close();
        process.exit();
    }

    const basePrompt = [{
        name: 'choice',
        message: 'What would you like to do?',
        type: 'list',
        choices: [{
            name: 'View All Employees',
            value: viewEmployees
        }, {
            name: 'Add Employee',
            value: addEmployee
        }, {
            name: 'Update Employee Role',
            value: updateEmployeeRole
        }, {
            name: 'Update Employee Manager',
            value: updateEmployeeManager
        }, {
            name: 'View Employees By Manager',
            value: viewEmployeesByManager
        }, {
            name: 'View Employees By Department',
            value: viewEmployeesByDepartment
        }, {
            name: 'Delete Employee',
            value: deleteEmployee
        }, {
            name: 'View All Roles',
            value: viewRoles
        }, {
            name: 'Add Role',
            value: addRole
        }, {
            name: 'Delete Role',
            value: deleteRole
        }, {
            name: 'View All Departments',
            value: viewDepartments
        }, {
            name: 'Add Department',
            value: addDepartment
        }, {
            name: 'Delete Department',
            value: deleteDepartment
        }, {
            name: 'Exit',
            value: exit
        }]
    }];

    // main event loop
    while (true) {
        const userInput = await inquirer.prompt(basePrompt);
        await userInput.choice(db);
    }
})()