#!/usr/bin/env python3
"""
GGWIFI Data Seeder
Creates initial admin user and sample data for the GGWIFI system
"""

import mysql.connector
import bcrypt
from datetime import datetime, timedelta
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'kolombo@123%',
    'database': 'ggwifi',
    'charset': 'utf8mb4'
}

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

def execute_query(connection, query, params=None):
    """Execute a SQL query"""
    try:
        cursor = connection.cursor()
        cursor.execute(query, params)
        connection.commit()
        return cursor.rowcount
    except mysql.connector.Error as err:
        print(f"Error executing query: {err}")
        return 0
    finally:
        cursor.close()

def seed_admin_user(connection):
    """Create admin user"""
    print("Creating admin user...")
    
    # Hash the password
    password_hash = hash_password("Ashruha@123%")
    
    query = """
    INSERT INTO users (
        id, full_name, phone_number, email, password_hash, 
        role, is_active, is_verified, created_at, updated_at
    ) VALUES (
        1, %s, %s, %s, %s, %s, %s, %s, %s, %s
    ) ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        email = VALUES(email),
        password_hash = VALUES(password_hash),
        role = VALUES(role),
        is_active = VALUES(is_active),
        is_verified = VALUES(is_verified),
        updated_at = VALUES(updated_at)
    """
    
    params = (
        'GGWIFI Admin',
        '0773404760',
        'admin@ggwifi.co.tz',
        password_hash,
        'ADMIN',
        True,
        True,
        datetime.now(),
        datetime.now()
    )
    
    rows_affected = execute_query(connection, query, params)
    print(f"Admin user created/updated. Rows affected: {rows_affected}")

def seed_locations(connection):
    """Create sample locations"""
    print("Creating sample locations...")
    
    locations = [
        (1, 'Main Office', 'Dar es Salaam, Tanzania', 'Dar es Salaam', 'Tanzania', -6.7924, 39.2083),
        (2, 'Branch Office', 'Arusha, Tanzania', 'Arusha', 'Tanzania', -3.3869, 36.6830)
    ]
    
    for loc in locations:
        query = """
        INSERT INTO locations (
            id, name, address, city, country, latitude, longitude, 
            is_active, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            address = VALUES(address),
            city = VALUES(city),
            country = VALUES(country),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            is_active = VALUES(is_active),
            updated_at = VALUES(updated_at)
        """
        
        params = loc + (True, datetime.now(), datetime.now())
        execute_query(connection, query, params)
    
    print("Sample locations created/updated")

def seed_packages(connection):
    """Create sample internet packages"""
    print("Creating sample packages...")
    
    packages = [
        (1, 'Basic Plan', 'Basic internet package for light usage', 25000, 30, 10, 5, 'HOTSPOT'),
        (2, 'Standard Plan', 'Standard internet package for regular usage', 45000, 30, 25, 10, 'HOTSPOT'),
        (3, 'Premium Plan', 'Premium internet package for heavy usage', 75000, 30, 50, 20, 'HOTSPOT'),
        (4, 'Unlimited Plan', 'Unlimited internet package', 100000, 30, -1, 50, 'HOTSPOT')
    ]
    
    for pkg in packages:
        query = """
        INSERT INTO packages (
            id, name, description, price, duration_days, data_limit_gb, 
            speed_mbps, type, is_active, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            description = VALUES(description),
            price = VALUES(price),
            duration_days = VALUES(duration_days),
            data_limit_gb = VALUES(data_limit_gb),
            speed_mbps = VALUES(speed_mbps),
            type = VALUES(type),
            is_active = VALUES(is_active),
            updated_at = VALUES(updated_at)
        """
        
        params = pkg + (True, datetime.now(), datetime.now())
        execute_query(connection, query, params)
    
    print("Sample packages created/updated")

def seed_routers(connection):
    """Create sample routers"""
    print("Creating sample routers...")
    
    routers = [
        (1, 'Main Router', '192.168.1.1', '00:11:22:33:44:55', 'MikroTik RB750', '7.12.1', 1),
        (2, 'Branch Router', '192.168.2.1', '00:11:22:33:44:66', 'MikroTik RB4011', '7.12.1', 2)
    ]
    
    for router in routers:
        query = """
        INSERT INTO routers (
            id, name, ip_address, mac_address, model, firmware_version, 
            location_id, is_online, is_active, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            ip_address = VALUES(ip_address),
            mac_address = VALUES(mac_address),
            model = VALUES(model),
            firmware_version = VALUES(firmware_version),
            location_id = VALUES(location_id),
            is_online = VALUES(is_online),
            is_active = VALUES(is_active),
            updated_at = VALUES(updated_at)
        """
        
        params = router + (True, True, datetime.now(), datetime.now())
        execute_query(connection, query, params)
    
    print("Sample routers created/updated")

def seed_customers(connection):
    """Create sample customers"""
    print("Creating sample customers...")
    
    customers = [
        (1, 'John Doe', '+255123456789', 'john.doe@example.com', 'HOTSPOT_USER'),
        (2, 'Jane Smith', '+255987654321', 'jane.smith@example.com', 'PPPOE_USER'),
        (3, 'Ahmed Hassan', '+255111222333', 'ahmed.hassan@example.com', 'HOTSPOT_USER')
    ]
    
    for customer in customers:
        query = """
        INSERT INTO customer_profiles (
            id, full_name, phone_number, email, user_type, 
            is_active, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s
        ) ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name),
            phone_number = VALUES(phone_number),
            email = VALUES(email),
            user_type = VALUES(user_type),
            is_active = VALUES(is_active),
            updated_at = VALUES(updated_at)
        """
        
        params = customer + (True, datetime.now(), datetime.now())
        execute_query(connection, query, params)
    
    print("Sample customers created/updated")

def main():
    """Main seeder function"""
    print("🌱 Starting GGWIFI Data Seeder...")
    print("=" * 50)
    
    # Create database connection
    connection = create_connection()
    if not connection:
        print("❌ Failed to connect to database. Exiting.")
        return
    
    try:
        # Run seeders
        seed_admin_user(connection)
        seed_locations(connection)
        seed_packages(connection)
        seed_routers(connection)
        seed_customers(connection)
        
        print("=" * 50)
        print("✅ GGWIFI Data Seeder completed successfully!")
        print("\n📋 Created/Updated:")
        print("  • Admin User: 0773404760 (password: Ashruha@123%)")
        print("  • 2 Locations")
        print("  • 4 Internet Packages")
        print("  • 2 Routers")
        print("  • 3 Sample Customers")
        print("\n🔐 Admin Login Credentials:")
        print("  Phone: 0773404760")
        print("  Password: Ashruha@123%")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    finally:
        connection.close()
        print("\n🔌 Database connection closed.")

if __name__ == "__main__":
    main()
