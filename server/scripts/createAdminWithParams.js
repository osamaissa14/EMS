import UserModel from "../models/usermodel.js";
import dotenv from "dotenv";
import { query } from "../config/db.js";
import readline from "readline";

// Load environment variables
dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input with default value
const promptWithDefault = (question, defaultValue) => new Promise((resolve) => {
  const displayQuestion = defaultValue 
    ? `${question} (default: ${defaultValue}): ` 
    : `${question}: `;
  
  rl.question(displayQuestion, (answer) => {
    resolve(answer.trim() || defaultValue || '');
  });
});

// Function to create admin account with user input
async function createAdminWithParams() {
  try {
    // Check if admin already exists
    const adminExists = await UserModel.adminExists();
    if (adminExists) {
      console.log("Admin account already exists. Cannot create another admin.");
      return;
    }

    console.log("\n=== Create Admin Account ===\n");
    console.log("You can set default values using environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME\n");
    
    // Get admin details from user input with environment variables as defaults
    const email = await promptWithDefault("Enter admin email", process.env.ADMIN_EMAIL);
    const name = await promptWithDefault("Enter admin name", process.env.ADMIN_NAME);
    const password = await promptWithDefault(
      "Enter admin password (min 10 chars, must include uppercase, lowercase, digit, and special char)", 
      process.env.ADMIN_PASSWORD
    );
    
    // Create admin account
    const admin = await UserModel.createAdmin({
      email,
      password,
      name
    });
    
    console.log("\nAdmin account created successfully:");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("\nPlease keep these credentials safe.");
  } catch (error) {
    console.error("\nError creating admin account:", error.message);
    if (error.message.includes("pattern")) {
      console.log("\nPassword requirements:");
      console.log("- At least 10 characters long");
      console.log("- At least one uppercase letter");
      console.log("- At least one lowercase letter");
      console.log("- At least one digit");
      console.log("- At least one special character (@$!%*?&)");
    }
  } finally {
    rl.close();
    // Close database connection
    await query.end();
    process.exit(0);
  }
}

// Run the function
createAdminWithParams();