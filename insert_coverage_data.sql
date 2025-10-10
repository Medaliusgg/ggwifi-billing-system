-- Insert Coverage Areas for GGNetworks
-- This script inserts location data for Dar es Salaam and Arusha

-- Dar es Salaam Coverage Areas
INSERT INTO locations (name, description, address, city, region, country, status, type, coverage_radius_km, population_density, infrastructure_quality, is_hotspot_available, is_pppoe_available, notes) VALUES
('City Centre', 'Central Business District of Dar es Salaam', 'Central Business District, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'COMMERCIAL', 2.5, 'High', 'Excellent', 1, 1, 'Primary business hub with excellent connectivity'),
('Oyster Bay', 'Upscale residential and commercial area', 'Oyster Bay, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 3.0, 'Medium-High', 'Excellent', 1, 1, 'Popular area with good infrastructure'),
('Masaki', 'Diplomatic and residential area', 'Masaki, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.8, 'Medium', 'Good', 1, 1, 'Diplomatic quarter with reliable service'),
('Mbezi Beach', 'Coastal residential area', 'Mbezi Beach, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.2, 'Medium', 'Good', 1, 1, 'Coastal area with growing connectivity'),
('Kunduchi', 'Northern coastal area', 'Kunduchi, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.0, 'Medium', 'Good', 1, 1, 'Northern coastal region'),
('Mikocheni', 'Residential and commercial area', 'Mikocheni, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.5, 'Medium-High', 'Good', 1, 1, 'Well-established residential area'),
('Kinondoni', 'Central residential district', 'Kinondoni, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.8, 'High', 'Good', 1, 1, 'Central residential area'),
('Upanga', 'Historic residential area', 'Upanga, Dar es Salaam, Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.0, 'Medium', 'Good', 1, 1, 'Historic area with good coverage');

-- Arusha Coverage Areas
INSERT INTO locations (name, description, address, city, region, country, status, type, coverage_radius_km, population_density, infrastructure_quality, is_hotspot_available, is_pppoe_available, notes) VALUES
('City Centre', 'Central Business District of Arusha', 'Central Business District, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'COMMERCIAL', 2.0, 'High', 'Good', 1, 1, 'Main business district of Arusha'),
('Njiro', 'Residential and commercial area', 'Njiro, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.5, 'Medium-High', 'Good', 1, 1, 'Popular residential area'),
('Sakina', 'Residential area with good infrastructure', 'Sakina, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.2, 'Medium', 'Good', 1, 1, 'Well-developed residential area'),
('Themi', 'Residential and educational area', 'Themi, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.0, 'Medium', 'Good', 1, 1, 'Educational institutions area'),
('Sanawari', 'Residential area', 'Sanawari, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.3, 'Medium', 'Good', 1, 1, 'Growing residential area'),
('Ngaramtoni', 'Suburban residential area', 'Ngaramtoni, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'SUBURBAN', 2.8, 'Medium', 'Good', 1, 1, 'Suburban area with good potential'),
('Moshono', 'Residential and agricultural area', 'Moshono, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RURAL', 3.0, 'Low-Medium', 'Fair', 1, 1, 'Mixed residential and agricultural area'),
('Baraa', 'Residential area', 'Baraa, Arusha, Tanzania', 'Arusha', 'Arusha', 'Tanzania', 'ACTIVE', 'RESIDENTIAL', 2.0, 'Medium', 'Good', 1, 1, 'Established residential area');

-- Update some packages to make them more suitable for the customer portal display
UPDATE packages SET 
    description = 'Perfect for quick browsing and social media access',
    is_popular = 1
WHERE id = 2;

UPDATE packages SET 
    description = 'Great for extended browsing and streaming',
    is_popular = 1
WHERE id = 4;

UPDATE packages SET 
    description = 'Ideal for daily internet usage and streaming',
    is_popular = 0
WHERE id = 5;

UPDATE packages SET 
    description = 'Basic home internet plan with reliable connectivity',
    is_popular = 1
WHERE id = 6;

UPDATE packages SET 
    description = 'Standard home internet plan for families',
    is_popular = 1
WHERE id = 7;

UPDATE packages SET 
    description = 'Premium home internet plan for heavy users',
    is_popular = 0
WHERE id = 8;

UPDATE packages SET 
    description = 'Business-grade internet plan for offices',
    is_popular = 0
WHERE id = 9;

-- Add some additional hotspot packages for better variety
INSERT INTO packages (name, type, price, duration_days, bandwidth_limit_mb, description, is_popular, is_active) VALUES
('Weekend Special - 48 Hours', 'HOTSPOT', 8000.00, 2, 2048, 'Perfect for weekend browsing and entertainment', 1, 1),
('Weekly Plan - 7 Days', 'HOTSPOT', 15000.00, 7, 5120, 'Great value for weekly internet needs', 0, 1),
('Monthly Hotspot - 30 Days', 'HOTSPOT', 45000.00, 30, 15360, 'Monthly hotspot plan for regular users', 0, 1);

-- Display the results
SELECT 'Coverage areas and packages have been successfully inserted!' as status; 