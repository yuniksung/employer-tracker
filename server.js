const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require("console.table");
const { title } = require("process");

const env = require('dotenv').config();

// DATABASE CONFIGURATION
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // YOUR USERNAME
    user: 'root',
    // YOUR PASSWORD
    password: process.env.DB_PASS,
    // NAME OF DATABASE
    database: 'employee_trackerDB'
});

// DATABASE CONNECTION
connection.connect(err =>{
    if(err) throw err;
    console.log('connected as id' + connection.threadId + '\n');
    activateTracker();
});

const activateTracker = () => {
    inquirer.prompt({
        name: "action", 
        type: "rawlist", 
        message: "What would you like to do?",
        choices: [
            // View
            "View all Employees",
            "View all roles",
            "View all departments",
            // Add
            "Add a New Role",
            "Add a new Department",
            "Add a new Employee",
            // Delete
            "Delete a Employee",
            "Delete a role",
            // Update
            "Update an Employee",
            "Exit"
            
        ]
    }).then(answer => {
        switch(answer.action){
            // VIEW
            case "View all departments": viewDepartment(); 
            break;
            case "View all Employees": viewEmployee(); 
            break;
            case "View all roles": viewRole(); 
            break;
            // ADD
            case "Add a new Department": addDepartment(); 
            break;
            case "Add a New Role": addRole(); 
            break;
            case "Add a new Employee": addEmployee(); 
            break;
            // DELETE
            case "Delete a Employee": deleteEmployee(); 
            break;
            case "Delete a role": deleteRole(); 
            break;
            // UPDATE
            case "Update an Employee": updateEmployee(); 
            break;
            // Exit
            case "Exit": connection.end(); 
            break;
            
        }
    });
};

// ==============================================================================
// vIEW FUNCTIONS
// ==============================================================================

// VIEW ALL DEPARTMENTS
const viewDepartment = () => {
    connection.query("select * from department;", (err,res) => {
        console.table(res);
        console.log("department list has uploaded");
        activateTracker();
    });
};

// VIEW ALL EMPLOYEES
const viewEmployee = () => {
    connection.query("select * from employee;", (err,res) => {
        console.table(res);
        console.log("Employee list has uploaded");
        activateTracker();
    });
};

// VIEW ALL ROLES
const viewRole = () => {
    connection.query("select * from role;", (err,res) => {
        console.table(res);
        console.log("Role list has uploaded");
        activateTracker();
    });
};

// ==============================================================================
// ADD FUNCTIONS
// ==============================================================================

// Add NEW DEPARTMENT
const addDepartment = () => {
  inquirer.prompt(
    [
      {
        type: "input",
        name: "names",
        message: "What is the department that you would like to add?"
      }
    ]
  ).then((answers) => {
    connection.query("INSERT INTO department SET ?",
      {
        names: answers.names,
      },
      function (err, res) {
        if (err) throw err;
        activateTracker();
      });
    });
}

  // Add NEW ROLE
const addRole = () => {
    const modify = "SELECT name FROM DEPARTMENT";
    connection.query(modify, (err,res) => {
      inquirer
      .prompt([
        {
        type:'input',
        name: 'roleName',
        message: 'Please specify the name of the new role:'
        },
        {
          type:'input',
          name: 'salary',
          message: 'Please specify the salary for this position:'
        },
        {
          type:'list',
          name: 'department',
          message: 'Which department does this role belongs to:',
          choices: [
            "HQ",
            "Operation",
            "Accounting and Finance"
          ]      
        },
      ])
      .then(answer =>{
        console.log(answer.roleName);    
        connection.query(
          "INSERT INTO role (title,salary,department_id) VALUES (?,?,(select id from department where names = ?))", 
          [answer.roleName, answer.salary, answer.department],
          (err,res) => {
            if(err) throw err;
            console.log(`"New role ${answer.roleName} has been added."`);
            activateTracker();
          }
        )
      });
    })
  };



  // Add NEW EMPLOYEE
const addEmployee = () => {
  const query = connection.query("SELECT employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.role_id=role.id;",
  function (err, res) {
    if (err) {
      throw err;
    }

    let roleArray = [];
    let employeeArray = [];
    employeeArray = ["NONE"];
    let employeeIDs = [];

    const query1 = connection.query("SELECT * FROM role",
      function (err, res) {
        if (err) {
          throw err;
        }
        res.forEach(role => roleArray.push(role.title));
      });

    const query2 = connection.query("SELECT * FROM employee",
    function (err, res) {
      if (err) {
        throw err;
      }
      res.forEach(employeeId => employeeIDs.push(employeeId.id));
      res.forEach(employee => employeeArray.push(`${employee.first_name} ${employee.last_name}`));
    });
    
    inquirer.prompt(
      [
        {
          type: "input",
          name: "firstName",
          message: "First name:"
        },
        {
          type: "input",
          name: "lastName",
          message: "Last name:"
        },
        {
          type: "rawlist",
          name: "role",
          message: "Role:",
          choices: roleArray
        },
        {
          type: "rawlist",
          name: "manager",
          message: "New employee's manager:",
          choices: employeeArray
        }
      ]
    ).then(function(answers) {
      let employeeIDIndex = employeeArray.indexOf(answers.manager) - 1;
      connection.query("INSERT INTO employee SET ?",
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: roleArray.indexOf(answers.role) + 1,
        manager_id: employeeIDs[employeeIDIndex]
      },
      function (err, res) {
        if (err) {
          throw err;
        }
        activateTracker();
      }
    );
  });
});
}

// ==============================================================================
// DELETE FUNCTIONS
// ==============================================================================

deleteEmployee = () => {
  const query = connection.query("SELECT * FROM employee",
    function (err, res) {
      const allEmployees = res;
      let allEmployeeNames = [];
      let employeeIds = [];
      allEmployees.forEach(employeeData => {
        allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
        employeeIds.push(employeeData.id);
      });
      if (allEmployees.length > 0) {  
        inquirer.prompt(
          {
            type: "rawlist",
            name: "employee",
            message: "Which employee would you like to remove?",
            choices: allEmployeeNames
          }
        ).then(function(answers){  

          const query = connection.query("DELETE FROM employee WHERE ?",
            {
              id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
            },
            function (err, res) {
              if (err) {
                throw err;
              }
              activateTracker();
          });
        });
      } else {
        activateTracker();
      }
  });
}

deleteRole = () => {
  const query = connection.query("SELECT * FROM role",
  function (err, res) {
    const allRoles = res;
    let allRoleTitles = [];
    let roleIds = [];
    allRoles.forEach(roleData => {
      allRoleTitles.push(roleData.title);
      roleIds.push(roleData.id);
    });
    if (allRoles.length > 0) {  
      inquirer.prompt(
        {
          type: "rawlist",
          name: "role",
          message: "Which role would you like to remove?",
          choices: allRoleTitles
        }
      ).then(function(answers){  
        const query = connection.query("DELETE FROM role WHERE ?",
          {
            id: roleIds[allRoleTitles.indexOf(answers.role)]
          },
          function (err, res) {
            if (err) {
              throw err;
            }
            activateTracker();
        });
      });
    } else {
      activateTracker();
    };
  });
};

// ==============================================================================
// UPDATE FUNCTIONS
// ==============================================================================

updateEmployee = () => {
  const query = connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.role_id
    FROM employee
    INNER JOIN role ON employee.role_id=role.id;`,
    function (err, res) {
      if (err) {
        throw err;
      }
      let allEmployees = res;
      let allEmployeeNames = [];
      let allRoleTitles = [];
      let employeeIds = [];
      let roleIds = [];

      const query2 = connection.query("SELECT * FROM role",
      function (err, res) {
        if (err) {
          throw err;
        }
        res.forEach(role => {
          roleIds.push(role.id);
          allRoleTitles.push(role.title)
        });
      });

      allEmployees.forEach(employeeData => {
        allEmployeeNames.push(`${employeeData.first_name} ${employeeData.last_name}`);
        employeeIds.push(employeeData.id);
      });

      if (allEmployees.length > 0) {
        inquirer.prompt(
          [
            {
              type: "rawlist",
              name: "employee",
              message: "Which employee would you like to change the role of?",
              choices: allEmployeeNames
            },
            {
              type: "rawlist",
              name: "newRole",
              message: "Which role would you like to assign to this employee?",
              choices: allRoleTitles
            }
          ]
        ).then(function(answers) {
          const query = connection.query(`UPDATE employee SET ? WHERE ?`,
          [
            {
              role_id: roleIds[allRoleTitles.indexOf(answers.newRole)]
            },
            {
              id: employeeIds[allEmployeeNames.indexOf(answers.employee)]
            }
          ],
          function (err, res) {
            if (err) {
              throw err;
            }
            activateTracker();
        });
      });
    } else {
      activateTracker();
    }
  });
}