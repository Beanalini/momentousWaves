

INSERT INTO department (names)
VALUES 
("Research and Development"),
("Advanced Engineering"),
("Electromagnetic Compatability"),
("Test Facilities"),
("Accounts"),
("Human Resources"),
("Marketing"),
("Technical Support");


INSERT INTO roles (title, salary, department_id)
VALUES 

("Technical Lead", 120000, 1),
("Technical spealist" ,130000, 1),
("Principal Engineer" , 85000, 1),
("Consultant", 70000, 1),
("Engineer", 40000, 1),
("Graduate Engineer", 30000, 1),
("Admin assistant",25000, 1),

("Chief Engineer", 110000, 2),
("Technical spealist", 100000, 2),
("Principal Engineer",90000, 2),
("Engineer", 35000, 2),
("Software Engineer", 80000 ,2),

("Manager",90000,3),
("Senior Engineer", 60000, 3),
("Project Engineer",45000,3),
("Technician",35000,3),

("Manager",80000,4),
("Project Engineer",50000,4),
("Senior Technician",40000,4),
("Technician",30000,4),

("Manager",90000,5),
("Accountant",110000,5),
("Senior Administrator",50000,5),
("Receptionist",25000,5),

("Manager",80000,6),
("Consultant",50000,6),
("Clerical support",23000,6),

("Manager",80000,7),
("senior Assistant",50000,7),
("Assistant",35000,7),

("Support Lead", 70000.00,8),
("Software Engineer", 50000.00,8),
("Web developer", 60000.00,8);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Sarah", "Swift",1,Null),
("Paul","Smith",2,1),
("Ruxandra","Enache",3,1),
("Emil","cassidy",4,1),
("Bin", "Liu", 5, 1),
("David","Granger",8,Null),
("Ian","Jones",10,2),
("Sophia","Paine",12,2),
("Alaister","Ruddle",13,Null),
("Richard","Young",15,9),
("Claire","Briggs",15,9),
("Chris","Ball",16,9),
("Bev","Hall",17,Null),
("Tahir","Majid",18,13),
("Ita","Jones",19,13),
("Gwyn","Davis",21,Null),
("Bob","Down",22,16),
("Jim","Morrison",25,Null),
("Mia","Brown",26,18),
("Saun","Grant",27,18),
("Tommy","Gomez",28,Null),
("Nicola","Cordova",29,21),
("Arthur","Mint",30,21),
("Joslin", "carsten", 31, Null),
("Huan", "Lortz", 32, 31),
("Pradeep", "Makrucki", 33, 31);

ALTER TABLE employees ADD manager_name VARCHAR(50);
UPDATE employees SET manager_name = first_name + last_name;