SELECT employees.id, employee.first_name, employees.last_name, roles.title, department.names 
    AS department, roles.salary, employees.manager_id   
    FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department on roles.department_id = department.id
    ORDER BY employees.id ;