const inquirer = require('inquirer');
const { stringNotEmptyValidator } = require('../helpers/validators');

async function viewEmployees(db) {
    const employees = await db.readEmployees();
    console.log(employees.toString());
}

async function viewEmployeesByManager(db) {
    const managers = (await db.readEmployees()).getNameIdMapping();
    // search for employees with no manager
    managers.unshift({
        name: 'None',
        value: null
    });
    const viewEmployeesByManagerPrompt = [{
        name: 'managerId',
        message: 'View employees with which manager?',
        type: 'list',
        choices: managers
    }];

    const options = await inquirer.prompt(viewEmployeesByManagerPrompt);
    const employees = await db.readEmployees(options);
    console.log(employees.toString());
}

async function viewEmployeesByDepartment(db) {
    const departments = (await db.readDepartments()).getNameIdMapping();
    const viewEmployeesByDepartmentPrompt = [{
        name: 'departmentId',
        message: 'View employees from which department?',
        type: 'list',
        choices: departments
    }];

    const options = await inquirer.prompt(viewEmployeesByDepartmentPrompt);
    const employees = await db.readEmployees(options);
    console.log(employees.toString());
}

async function addEmployee(db) {
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

async function updateEmployeeRole(db) {
    const employeesP = db.readEmployees();
    const rolesP = db.readRoles();
    const [employees, roles] = (await Promise.all([employeesP, rolesP])).map(rs => rs.getNameIdMapping());
    const updateEmployeeRolePrompt = [{
        name: 'employeeId',
        message: 'Which employee\'s role do you want to update?',
        type: 'list',
        choices: employees
    }, {
        name: 'roleId',
        message: 'Which role do you want to assign the selected employee?',
        type: 'list',
        choices: roles
    }];

    const { employeeId, roleId } = await inquirer.prompt(updateEmployeeRolePrompt);
    return db.updateEmployeeRole(employeeId, roleId);
}

async function updateEmployeeManager(db) {
    const employees = (await db.readEmployees()).getNameIdMapping();
    const updateEmployeeManagerPrompt = [{
        name: 'employeeId',
        message: 'Which employee\'s manager do you want to update?',
        type: 'list',
        choices: employees
    }, {
        name: 'managerId',
        message: 'Who should be the selected employee\'s manager?',
        type: 'list',
        choices: function(values) {
            return [{
                name: 'None',
                value: null
            },
            ...employees.filter(employee => employee.value !== values.employeeId)];
        }
    }];

    const { employeeId, managerId } = await inquirer.prompt(updateEmployeeManagerPrompt);
    return db.updateEmployeeManager(employeeId, managerId);
}

async function deleteEmployee(db) {
    const employees = (await db.readEmployees()).getNameIdMapping();
    const deleteEmployeePrompt = [{
        name: 'employeeId',
        message: 'Delete which employee?',
        type: 'list',
        choices: employees
    }];

    const { employeeId } = await inquirer.prompt(deleteEmployeePrompt);
    const wasDeleted = await db.deleteEmployee(employeeId);
    if (wasDeleted) {
        console.log('Employee deleted');
    } else {
        console.log('Employee could not be deleted.  Are other employees managed by them?');
    }
}

module.exports = {
    viewEmployees,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    deleteEmployee
}