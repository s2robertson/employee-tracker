const inquirer = require('inquirer');
const { stringNotEmptyValidator } = require('../helpers/validators');

async function viewDepartments(db) {
    const departments = await db.readDepartments();
    console.log(departments.toString());
}

async function addDepartment(db) {
    const addDeptPrompt = [{
        name: 'name',
        message: 'What is the name of the department?',
        type: 'input',
        validator: stringNotEmptyValidator('Department name is required')
    }];

    const { name } = await inquirer.prompt(addDeptPrompt);
    return db.insertDepartment(name);
}

async function deleteDepartment(db) {
    const departments = (await db.readDepartments()).getNameIdMapping();
    const deleteDepartmentPrompt = [{
        name: 'departmentId',
        message: 'Delete which department?',
        type: 'list',
        choices: departments
    }];

    const { departmentId } = await inquirer.prompt(deleteDepartmentPrompt);
    const wasDeleted = await db.deleteDepartment(departmentId);
    if (wasDeleted) {
        console.log('Department deleted');
    } else {
        console.log('Department could not be deleted.  Are there roles connected to it?');
    }
}

module.exports = {
    viewDepartments,
    addDepartment,
    deleteDepartment
}