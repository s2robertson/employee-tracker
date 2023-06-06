require('dotenv').config();
// const inquirer = require('inquirer');

(async function() {
    const db = await require('./db/db');

    // await db.readDepartments();
    // await db.readRoles();
    // await db.readEmployees();
    // await db.insertDepartment('Service');
    await db.insertRole('Customer Service', '80000', 5);
    await db.close();
})()