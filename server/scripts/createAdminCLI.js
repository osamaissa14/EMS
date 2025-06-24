import UserModel from "../models/usermodel.js";
import dotenv from "dotenv";
import { query } from "../config/db.js";

// Load environment variables
dotenv.config();

// Function to create admin account with command line arguments
async function createAdminCLI() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i += 2) {
      if (args[i].startsWith('--')) {
        options[args[i].slice(2)] = args[i + 1];
      }
    }
    
    // Use environment variables as fallbacks if command line args not provided
    const email = options.email || process.env.ADMIN_EMAIL;
    const password = options.password || process.env.ADMIN_PASSWORD;
    const name = options.name || process.env.ADMIN_NAME;
    
    // Check required parameters
    if (!email || !password || !name) {
      console.log("\nUsage: node createAdminCLI.js --email admin@example.com --password SecurePass123! --name 'Admin Name'");
      console.log("\nAll parameters are required (either as command line arguments or environment variables):");
      console.log("  --email    : Admin email address (or set ADMIN_EMAIL environment variable)");
      console.log("  --password : Admin password (or set ADMIN_PASSWORD environment variable)");
      console.log("  --name     : Admin name (or set ADMIN_NAME environment variable)");
      return;
    }

    // Check if admin already exists
    const adminExists = await UserModel.adminExists();
    if (adminExists) {
      console.log("Admin account already exists. Cannot create another admin.");
      return;
    }

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
    // Close database connection
    await query.end();
    process.exit(0);
  }
}

// Run the function
createAdminCLI();