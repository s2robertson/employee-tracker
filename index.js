require('dotenv').config();
const inquirer = require('inquirer');

function stringNotEmptyValidator(errMsg) {
    return function validator(value) {
        if (value == undefined || value == null || value.trim().length == 0) {
            return errMsg;
        }
        return true;
    }
}

(async function() {
    const db = await require('./db/db');

    async function exit() {
        await db.close();
        process.exit();
    }

    async function viewDepartments() {
        const departments = await db.readDepartments();
        console.log(departments.toString());
    }

    async function addDepartment() {
        const addDeptPrompt = [{
            name: 'name',
            message: 'What is the name of the department?',
            type: 'input',
            validator: stringNotEmptyValidator('Department name is required')
        }];

        const { name } = await inquirer.prompt(addDeptPrompt);
        return db.insertDepartment(name);
    }

    async function viewRoles() {
        const roles = await db.readRoles();
        console.log(roles.toString());
    }

    const salaryNotEmptyValidator = stringNotEmptyValidator('Role salary is required');
    async function addRole() {
        const departments = (await db.readDepartments()).getNameIdMapping();
        const addRolePrompt = [{
            name: 'title',
            message: 'What is the name of the role?',
            type: 'input',
            validator: stringNotEmptyValidator('Role name is required')
        }, {
            name: 'salary',
            message: 'What is the salary of the role?',
            type: 'input',
            validator: function(value) {
                const notEmptyCheck = salaryNotEmptyValidator(value);
                if (notEmptyCheck !== true) {
                    return notEmptyCheck;
                }
                const reCheck = /^\d{1, 10}$/.test(value.trim());
                return reCheck || 'Salary must be 1-10 digits, with no spaces';
            }
        }, {
            name: 'departmentId',
            message: 'What department does the role belong to?',
            type: 'list',
            choices: departments
        }];

        const { title, salary, departmentId } = await inquirer.prompt(addRolePrompt);
        return db.insertRole(title, salary, departmentId);
    }

    async function viewEmployees() {
        const employees = await db.readEmployees();
        console.log(employees.toString());
    }

    async function addEmployee() {
        const rolesP = db.readRoles();
        const managersP = db.readEmployees();
        const [roles, managers] = (await Promise.all([rolesP, managersP])).map(rs => rs.getNameIdMapping());
        // allow no manager
        managers.unshift({
            name: 'None',
            value: null
        });
        const addEmployeePrompt = [{
            name: 'firstName',
            message: 'What is the employee\'s first name?',
            type: 'input',
            validator: stringNotEmptyValidator('First name is required')
        }, {
            name: 'lastName',
            message: 'What is the employee\'s last name?',
            type: 'input',
            validator: stringNotEmptyValidator('Last name is required')
        }, {
            name: 'roleId',
            message: 'What is the employee\'s role?',
            type: 'list',
            choices: roles
        }, {
            name: 'managerId',
            message: 'Who is the employee\'s manager?',
            type: 'list',
            choices: managers
        }];

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt(addEmployeePrompt);
        return db.insertEmployee(firstName, lastName, roleId, managerId);
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
            name: 'View All Roles',
            value: viewRoles
        }, {
            name: 'Add Role',
            value: addRole
        }, {
            name: 'View All Departments',
            value: viewDepartments
        }, {
            name: 'Add Department',
            value: addDepartment
        }, {
            name: 'Exit',
            value: exit
        }]
    }];

    // main event loop
    while (true) {
        const userInput = await inquirer.prompt(basePrompt);
        await userInput.choice();
    }

    // await db.readRoles();
    // await db.readEmployees();
    // await db.insertDepartment('Service');
    // await db.insertRole('Customer Service', '80000', 5);
    // await db.insertEmployee('Sam', 'Kash', 9, 3);
    // await db.updateEmployeeRole(9, 1);
    // await db.close();
})()