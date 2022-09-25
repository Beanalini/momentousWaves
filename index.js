//import dependancies
const inquirer = require("inquirer");
const mysql = require('mysql2');
const conTable = require('console.table');
const logo = require('asciiart-logo');



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
                "View Employees by department",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "View utilised budget by department"

                
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
            case "Update an employee role":
                updateEmp();
            
            break;
            case "View Employees by department":
                viewEmpDep();
            
            break;
            case "View utilised budget by department":
                viewDepbudget();
            
            break;
        }
        
    })
}

const addRole = () => {
    db.query('SELECT * FROM department', function (err, res) {
        if(err) throw err;              
        
        return inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter title of the new role",            
            },
            {
                type: "input",
                name: "salary",
                message: "Please enter the salary for the new role",            
            },
            {
                type: "list",
                name: "department",
                message: "Please select the department the new role belongs to", 
                choices: res.map(a =>a.names)
            }
        ]).then((response) => {
            //extract department id
            //const choice = res.find(x=> x.id===response.department);
            const choice = res.filter(x => x.names == response.department);
            //console.log(res);
            //console.log(choice[0].id);
            //console.log(response);
           db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${response.title}", ${response.salary}, ${choice[0].id})`, function (err, res) {
                if(err) throw err;
                console.log(`The new ${response.title} role has been added to the database`);
                viewDepartments();
        
            });   
    
        })
    
    })
    
}




const viewEmpDep = () => {

    db.query('SELECT * FROM department', function (err, res) {
        if(err) throw err;              
        
        return inquirer.prompt([
            
            {
                type: "list",
                name: "department",
                message: "Please select the department  you want to view the employees in:", 
                choices: res.map(a =>a.names)
            }
        ]).then((response) => {
            
            const choice = res.filter(x => x.names == response.department);
            
           db.query(`SELECT DISTINCT employees.first_name, employees.last_name, roles.title, roles.salary, department.names AS department
            FROM employees
            JOIN
            (roles 
            JOIN department 
            ON department.id = roles.department_id)
            ON employees.role_id = roles.id
            WHERE department_id = ${parseInt(choice[0].id)};`, function (err, res) {         
               
                if(err) throw err;
                console.table(res);
                userMainMenu();
        
            });   
    
        })
    
    })

}

const viewDepbudget = () => {

    db.query('SELECT * FROM department', function (err, res) {
        if(err) throw err;              
        
        return inquirer.prompt([
            
            {
                type: "list",
                name: "department",
                message: "Please select the department's utilised budget you want to view:", 
                choices: res.map(a =>a.names)
            }
        ]).then((response) => {
            
            const choice = res.filter(x => x.names == response.department);
            
           db.query(`SELECT DISTINCT SUM(roles.salary) AS budget, department.names AS department
            FROM employees
            JOIN
            (roles 
            JOIN department 
            ON department.id = roles.department_id)
            ON employees.role_id = roles.id
            WHERE department_id = ${parseInt(choice[0].id)};`, function (err, res) {         
               
                if(err) throw err;
                console.table(res);
                userMainMenu();
        
            });   
    
        })
    
    })

}




const addEmp = () => {
    let f_name;  
    let l_name;
    let j_id;
    let man_id;  
    db.query('SELECT * FROM roles', function (err, res) {
        if(err) throw err;
                   
        
        return inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Please enter the employee's first name",            
            },
            {
                type: "input",
                name: "last_name",
                message: "Please enter the employee's last name",            
            },
            {
                type: "list",
                name: "job_title",
                message: "Please select the employee's job title", 
                choices: res.map(a =>a.title)
            }
        ]).then((response) => {
            f_name = response.first_name;  
            l_name = response.last_name;          
            choice = res.filter(x => x.title == response.job_title);
            j_id = choice[0].id


            //call db to get employee data
            db.query('SELECT * FROM employees', function (err, res) {
                if(err) throw err;
                
            return inquirer.prompt([
                    {
                        type: "list",
                        name: "man_name",
                        message: "Please select the employee's manager:", 
                        choices: res.map(a =>a.first_name.concat( ' ', a.last_name)),
                        default: "none"
                }
                ]).then((response) => {
                    console.log(`Manager selected is ${response.man_name}`)
                    //get the manager id from the employee table
                    const manID = res.filter(x => (x.first_name.concat( ' ', x.last_name) == response.man_name));
                    man_id = manID[0].id;
                    
                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${f_name}", "${l_name}", ${parseInt(j_id)}, ${parseInt(man_id)})`, function (err, res) {
                        if(err) throw err;
                        console.log(`${f_name} ${l_name} has been added as a new employee`);
                        viewDepartments();
                
                    });  
                })
            })      
        })    
    })  
    
}

const updateEmp = () => {

    let f_name;  
    let l_name;
    let emp_id;
    let j_id;
    console.log("inside updateEmp()");
    db.query('SELECT * FROM employees', function (err, res) {
        if(err) throw err;
                   
        
        return inquirer.prompt([
            {
                type: "list",
                name: "emp_name",
                message: "Which employee's role do you want to update?", 
                choices: res.map(a =>a.first_name.concat( ' ', a.last_name)),
                default: "none"
            }

            
        ]).then((response) => {

            const choice = res.filter(x => (x.first_name.concat( ' ', x.last_name) == response.emp_name));
                 
            //choice = res.filter(x => x.title == response.job_title);
            emp_id = choice[0].id
            f_name = choice[0].first_name;  
            l_name = choice[0].last_name;


            //call db to get role data
            db.query('SELECT * FROM roles', function (err, res) {
                if(err) throw err;
                
                return inquirer.prompt([
                    {
                        type: "list",
                        name: "new_role",
                        message: "Please select the new role you want to assign to the selected employee:", 
                        choices: res.map(a =>a.title),
                        default: "none"
                }
                ]).then((response) => {
                    console.log(`New role selected is ${response.new_role}`)
                    const choice = res.filter(x => x.title == response.new_role);
                    j_id = choice[0].id
                    console.log(`UPDATE employees SET role_id = ${parseInt(j_id)} WHERE id = ${parseInt(emp_id)}`);
                    db.query(`UPDATE employees SET role_id = ${parseInt(j_id)} WHERE id = ${parseInt(emp_id)}`, function (err, res) {
                        if(err) throw err;
                        console.log(`${f_name} ${l_name} role has been updated to ${response.new_role}`);
                        console.log(`UPDATE employees SET role_id = ${parseInt(j_id)} WHERE id = ${parseInt(emp_id)}`);     
                        userMainMenu();                  
                
                    });  
                })
            })      
        })    
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
           // viewDepartments();
    
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

    const search = `
    
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.names 
    AS department, roles.salary, employees.manager_id, employees.manager_name 
    FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department on roles.department_id = department.id
    ORDER BY employees.id;`;


    //select employees.firstname + ' ' + employees.lastname AS managername 
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