const inquirer = require('inquirer');
const { stringNotEmptyValidator } = require('../helpers/validators');

async function viewDepartments(db) {
    const departments = await db.readDepartments();
    console.log(departments.toString());
}

const departmentNameNotEmptyValidator = stringNotEmptyValidator('Department name is required');

async function addDepartment(db) {
    const addDeptPrompt = [{
        name: 'name',
        message: 'What is the name of the department?',
        type: 'input',
        validator: departmentNameNotEmptyValidator
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

async function viewDepartmentBudgetUtilization(db) {
    const departments = (await db.readDepartments()).getNameIdMapping();
    const viewBudgetPrompt = [{
        name: 'departmentId',
        message: 'View budget utilization for which department?',
        type: 'list',
        choices: departments
    }];

    const { departmentId } = await inquirer.prompt(viewBudgetPrompt);
    const budgetUtilization = await db.viewDepartmentBudgetUtilization(departmentId);
    console.log(`Total budget utilization: ${budgetUtilization}`);
}

module.exports = {
    viewDepartments,
    addDepartment,
    deleteDepartment,
    viewDepartmentBudgetUtilization
}