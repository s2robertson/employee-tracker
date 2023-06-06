require('dotenv').config();
const inquirer = require('inquirer');

(async function() {
    const db = await require('./db/db');

    async function exit() {
        await db.close();
        process.exit();
    }

    function viewDepartments() {
        return db.readDepartments();
    }

    const basePrompt = [{
        name: 'choice',
        message: 'What would you like to do?',
        type: 'list',
        choices: [{
            name: 'View All Departments',
            value: viewDepartments
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