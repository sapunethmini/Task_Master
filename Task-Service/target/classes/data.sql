-- Sample data for tasks table
INSERT INTO tasks (title, description, status, category, priority, user_id, created_at, updated_at) VALUES
-- High Priority Tasks
('Implement Authentication', 'Set up JWT authentication for the application', 'IN_PROGRESS', 'Development', 'HIGH', 1, NOW(), NOW()),
('Fix Security Vulnerability', 'Address the reported security issue in user authentication', 'TODO', 'Security', 'HIGH', 1, NOW(), NOW()),

-- Medium Priority Tasks
('Update Documentation', 'Update API documentation with new endpoints', 'TODO', 'Documentation', 'MEDIUM', 2, NOW(), NOW()),
('Code Review', 'Review pull requests for the new feature', 'IN_PROGRESS', 'Development', 'MEDIUM', 2, NOW(), NOW()),
('Database Optimization', 'Optimize database queries for better performance', 'TODO', 'Database', 'MEDIUM', 1, NOW(), NOW()),

-- Low Priority Tasks
('Update Dependencies', 'Update project dependencies to latest versions', 'TODO', 'Maintenance', 'LOW', 3, NOW(), NOW()),
('Clean Up Code', 'Remove unused code and comments', 'DONE', 'Maintenance', 'LOW', 3, NOW(), NOW()),
('Add Unit Tests', 'Add unit tests for new features', 'TODO', 'Testing', 'LOW', 2, NOW(), NOW()),

-- Mixed Categories and Statuses
('Design New Feature', 'Create wireframes for the new feature', 'IN_PROGRESS', 'Design', 'MEDIUM', 1, NOW(), NOW()),
('User Testing', 'Conduct user testing for the new interface', 'TODO', 'Testing', 'HIGH', 2, NOW(), NOW()),
('Deploy to Production', 'Deploy the latest version to production', 'DONE', 'DevOps', 'HIGH', 1, NOW(), NOW()),
('Monitor Performance', 'Set up performance monitoring', 'IN_PROGRESS', 'DevOps', 'MEDIUM', 3, NOW(), NOW()),
('Update User Guide', 'Update the user guide with new features', 'TODO', 'Documentation', 'LOW', 2, NOW(), NOW()); 