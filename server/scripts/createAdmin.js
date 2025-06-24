import UserModel from "../models/usermodel.js";
import dotenv from "dotenv";
import { query } from "../config/db.js";
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Function to create admin account
async function createAdminAccount() {
  try {
    // Check if admin already exists
    const adminExists = await UserModel.adminExists();
    if (adminExists) {
      console.log("Admin account already exists. Cannot create another admin.");
      process.exit(0);
    }

    // Get admin credentials from environment variables or use defaults
    const adminData = {
      email: process.env.ADMIN_EMAIL || "admin@lms.com",
      password: process.env.ADMIN_PASSWORD || "Admin@123456", // This meets the admin password requirements
      name: process.env.ADMIN_NAME || "System Administrator"
    };

    console.log("Creating admin account...");
    const admin = await UserModel.createAdmin(adminData);
    console.log("Admin account created successfully:");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("\nPlease change the password after first login for security reasons.");
  } catch (error) {
    console.error("Error creating admin account:", error.message);
  } finally {
    // Close database connection
    await query.end();
    process.exit(0);
  }
}

// Run the function
createAdminAccount();