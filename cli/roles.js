const inquirer = require('inquirer');
const { stringNotEmptyValidator } = require('../helpers/validators');

async function viewRoles(db) {
    const roles = await db.readRoles();
    console.log(roles.toString());
}

const titleNotEmptyValidator = stringNotEmptyValidator('Role name is required');
const salaryNotEmptyValidator = stringNotEmptyValidator('Role salary is required');
const salaryRegExp = /^\d{1, 10}$/;
function salaryValidator(value) {
    const notEmptyCheck = salaryNotEmptyValidator(value);
    if (notEmptyCheck !== true) {
        return notEmptyCheck;
    }
    const reCheck = salaryRegExp.test(value.trim());
    return reCheck || 'Salary must be 1-10 digits, with no spaces';
}

async function addRole(db) {
    const departments = (await db.readDepartments()).getNameIdMapping();
    const addRolePrompt = [{
        name: 'title',
        message: 'What is the name of the role?',
        type: 'input',
        validator: titleNotEmptyValidator
    }, {
        name: 'salary',
        message: 'What is the salary of the role?',
        type: 'input',
        validator: salaryValidator
    }, {
        name: 'departmentId',
        message: 'What department does the role belong to?',
        type: 'list',
        choices: departments
    }];

    const { title, salary, departmentId } = await inquirer.prompt(addRolePrompt);
    const wasAdded = await db.insertRole(title, salary, departmentId);
    if (wasAdded) {
        console.log('Role added');
    } else {
        console.log('*** Insert failed ***');
    }
    console.log('');
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
    console.log('');
}

module.exports = {
    viewRoles,
    addRole,
    deleteRole
}