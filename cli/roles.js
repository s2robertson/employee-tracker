const inquirer = require('inquirer');
const { stringNotEmptyValidator } = require('../helpers/validators');

async function viewRoles(db) {
    const roles = await db.readRoles();
    console.log(roles.toString());
}

const salaryNotEmptyValidator = stringNotEmptyValidator('Role salary is required');
async function addRole(db) {
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

async function deleteRole(db) {
    const roles = (await db.readRoles()).getNameIdMapping();
    const deleteRolePrompt = [{
        name: 'roleId',
        message: 'Delete which department?',
        type: 'list',
        choices: roles
    }];

    const { roleId } = await inquirer.prompt(deleteRolePrompt);
    const wasDeleted = await db.deleteRole(roleId);
    if (wasDeleted) {
        console.log('Role deleted');
    } else {
        console.log('Role could not be deleted.  Are there employees assigned to it?');
    }
}

module.exports = {
    viewRoles,
    addRole,
    deleteRole
}