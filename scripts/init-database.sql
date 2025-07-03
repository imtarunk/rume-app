-- Create database tables
-- This script will be automatically executed when you run the application

-- Users table is created by NextAuth adapter
-- Additional tables are defined in schema.prisma

-- Insert sample data for development
INSERT INTO "User" (id, name, email, username, "createdAt", "updatedAt")
VALUES 
  ('sample-user-1', 'John Doe', 'john@example.com', 'johndoe', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create sample portfolio templates
-- These would typically be managed through an admin interface
