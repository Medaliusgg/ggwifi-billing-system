-- Fix corrupted password hash for admin user
-- The hash was corrupted because $ signs were interpreted by shell

UPDATE users 
SET password = '$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm' 
WHERE username = 'medalius';

-- Verify the update
SELECT username, LEFT(password, 30) as hash_start, LENGTH(password) as hash_length
FROM users 
WHERE username = 'medalius';




