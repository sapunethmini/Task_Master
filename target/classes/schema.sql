ALTER TABLE tasks ADD COLUMN temp_priority INT;

-- Copy existing priority values to the temp column (if possible)
UPDATE tasks SET temp_priority =
                     CASE
                         WHEN priority = '0' THEN 0
                         WHEN priority = '1' THEN 1
                         WHEN priority = '2' THEN 2
                         WHEN priority = 'LOW' THEN 0
                         WHEN priority = 'MEDIUM' THEN 1
                         WHEN priority = 'HIGH' THEN 2
                         ELSE 0 -- Default to LOW
                         END;

-- Drop the original priority column
ALTER TABLE tasks DROP COLUMN priority;

-- Add the priority column back with the correct type
ALTER TABLE tasks ADD COLUMN priority VARCHAR(20);

-- Set the values based on the temp column
UPDATE tasks SET priority =
                     CASE
                         WHEN temp_priority = 0 THEN 'LOW'
                         WHEN temp_priority = 1 THEN 'MEDIUM'
                         WHEN temp_priority = 2 THEN 'HIGH'
                         ELSE 'LOW' -- Default to LOW
                         END;

-- Remove the temporary column
ALTER TABLE tasks DROP COLUMN temp_priority;

-- You can also add a constraint to ensure only valid values are used
ALTER TABLE tasks ADD CONSTRAINT check_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'));

-- Update existing priority values to match the new enum values
UPDATE tasks 
SET priority = CASE 
    WHEN priority = '0' OR priority = 'LOW' THEN 'LOW'
    WHEN priority = '1' OR priority = 'MEDIUM' THEN 'MEDIUM'
    WHEN priority = '2' OR priority = 'HIGH' THEN 'HIGH'
    ELSE 'LOW'
END;

-- Add constraint to ensure only valid values
ALTER TABLE tasks ADD CONSTRAINT check_priority 
CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'));

-- Add new columns for team, dueDate, and duration
ALTER TABLE tasks ADD COLUMN team VARCHAR(255);
ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP;
ALTER TABLE tasks ADD COLUMN duration INTEGER;

-- Ensure user_id is not nullable
ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;