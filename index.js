//import dependancies
const inquirer = require("inquirer");
const mysql = require('mysql2');
const conTable = require('console.table');
const logo = require('asciiart-logo');
const { ADDRGETNETWORKPARAMS } = require("dns");


// establish  connection to database
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password:'TerraForm13$',
    database: 'staff_db'
  });



  //connect and initialise CMS
  db.connect( (err) => {

    if (err) {
        console.error(`error connecting ${err.stack}`);
        return;
    }
    console.log('connected as id ' + db.threadId);
    console.log(
        logo({
            name: 'Employee Tracking System',
            font: 'Speed',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-green',
            textColor: 'green',
        })
        .emptyLine()
        .right('version 2.7')
        .emptyLine()
        //.center(longText)
        .render()
    );
        //Start db interaction 
        init();

  }) 

  const userMainMenu = () => {
    return inquirer.prompt([        
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role"             

            ]    
        },
        
    ]).then((response) => {
        switch (response.mainMenu) {
            case "View all departments":
                viewDepartments();                
                break;
            case "View all roles":
                viewRoles();
                
                break;
            case "View all employees":
                viewStaff();
               
                break;
            case "Add a department":
                addDep();
                
                break;
            case "Add a role":
                addRole();
                
                break;    
            case "Add an employee":
                addEmp();
            
            break;
        }
        
    })
}

const getchoices = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if(err) throw err;
              
        const choice = res.map(a =>a.names);
        console.log(choice);
        return choice;

    }); 


}

const addRole = () => {

    return inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter title of the new role",            
        },
        {
            type: "input",
            name: "title",
            message: "Please enter the salary for the new role",            
        },
        {
            type: "input",
            name: "department",
            message: "Please select the department the new role belongs to", 
            choices: getchoices(),           
        }

    ]).then((response) => {
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${response.depName}")`, function (err, res) {
            if(err) throw err;
            console.log(`${response.depName} has been added to the database`);
            viewDepartments();
    
        });   




    })






}


const addDep = () => {

        //Prompt User for department name
        return inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "Please enter the department's name",
            
        }

    ]).then((response) => {
        db.query(`INSERT INTO department (names) VALUES ("${response.depName}")`, function (err, res) {
            if(err) throw err;
            console.log(`${response.depName} has been added to the database`);
            viewDepartments();
    
        });   




    })


}



const viewDepartments = () => {

    //const search = `SELECT * FROM department`;
    db.query('SELECT * FROM department', function (err, res) {
        if(err) throw err;
        console.table(res);
        //console.log(res);
        userMainMenu();
        

    });   
}

const viewRoles= () => {

    //const search = `SELECT * FROM department`;
    db.query('SELECT * FROM roles', function (err, res) {
        if(err) throw err;
        console.table(res);
        userMainMenu();

    });
}

const viewStaff = () => {

    //const search = `SELECT * FROM department`;

    const search = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.names 
    AS department, roles.salary, employees.manager_id   
    FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department on roles.department_id = department.id
    ORDER BY employees.id` ;

    db.query(search, function (err, res) {
        if(err) throw err;
        console.table(res);
        userMainMenu();

    });
}

  //This function initialises the team profile generator
const init = () => {
    //This function starts the user prompt questions
    userMainMenu();
};