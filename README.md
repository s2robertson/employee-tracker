# Employee Tracker

## Description
This employee tracker app app allows a user to perform CRUD operations pertaining to employees,
roles/jobs, and company departments.  I created this app as an exercise in using MySQL in Node.js.

## Installation
Before starting the app, `db/schema.sql` should be run to initialize the database.  Sample data can
be loaded from `db/seeds.sql`.  Also, environment variables need to be set for the database user
(`DB_USER`), database password (`DB_PASSWORD`), and optionally host name (`DB_HOST`) and database
name (`DB_NAME`).  These values will be picked up automatically if they are entered in a `.env` file 
in the project root (see the link to `dotenv` below).

## Usage
The app is run from the command line, and will display a list of options.  Each department has a name.
Each role has a title, a salary, and a department.  Each employee has first and last names, a role,
and (optionally) a manager.  In addition to adding and viewing entities, you can update an employee's 
role and manager, and can view employees filtered by role or manager.  You can also delete entities,
though this operation may fail if another entity depends on the one you are trying to delete.  In the
event of such a conflict, error messages will suggest where it might be.  Finally, you can view the
total utilized budget for a department, which is the sum of the salaries of all employees working in
the department.

[Watch a sample usage video](https://drive.google.com/file/d/1GPXXwzabNjcqbkBJNvrpojtUaL2fEOac/view)

## Credits
The following npm packages were used:
* [inquirer](https://www.npmjs.com/package/inquirer/v/8.2.4)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [dotenv](https://www.npmjs.com/package/dotenv)

## License
MIT