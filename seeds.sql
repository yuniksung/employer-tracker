INSERT INTO department (names)
VALUES 
("HQ"), 
("Operation"), 
("Accounting and Finance");

-- Role
INSERT INTO role (title, salary, department_id)
VALUES 
("General Manager", 80000, (SELECT id FROM department WHERE names = "HQ")), 
("Project Manager", 60000, (SELECT id FROM department WHERE names = "HQ")),
("Product Coordinator", 45000, (SELECT id FROM department WHERE names = "Accounting and Finance")),
("Event Coordinator", 45000, (SELECT id FROM department WHERE names = "Accounting and Finance")), 
("Audio Engineer", 35000, (SELECT id FROM department WHERE names = "Operation")), 
("Video Engineer", 35000, (SELECT id FROM department WHERE names = "Operation")), 
("Lighting Engineer", 35000, (SELECT id FROM department WHERE names = "Operation"));

-- Managers
INSERT INTO manager (first_name, last_name, role_id)
VALUES 
("Yunik", "Sung", (SELECT id FROM role WHERE title = "Project Manager")),
("Harold", "Jang", (SELECT id FROM role WHERE title = "General Manager"));

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Harold", "Jang", (SELECT id FROM role WHERE title = "General Manager"), (SELECT id FROM manager WHERE last_name = "Jang")), 
("Yunik", "Sung", (SELECT id FROM role WHERE title = "Project Manager"), (SELECT id FROM manager WHERE last_name = "Jang")), 
("Jacob", "Cho", (SELECT id FROM role WHERE title = "Video Engineer"), (SELECT id FROM manager WHERE last_name = "Sung")), 
("Paul", "Raul", (SELECT id FROM role WHERE title = "Audio Engineer"), (SELECT id FROM manager WHERE last_name = "Sung")),
("Richard", "Lee", (SELECT id FROM role WHERE title = "Lighting Engineer"), (SELECT id FROM manager WHERE last_name = "Sung")),
("Jessica", "Myle", (SELECT id FROM role WHERE title = "Product Coordinator"), (SELECT id FROM manager WHERE last_name = "Sung")),
("Dennis", "White", (SELECT id FROM role WHERE title = "Event Coordinator"), (SELECT id FROM manager WHERE last_name = "Sung"));