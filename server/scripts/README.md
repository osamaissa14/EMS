# LMS Admin Scripts

This directory contains utility scripts for the LMS system administration.

## Environment Variables

All admin scripts support using environment variables for admin credentials. These are already configured in your `.env` file:

```
ADMIN_EMAIL=admin@EMS.com
ADMIN_PASSWORD=1235@admin
ADMIN_NAME="Main Admin"
```

## Available Scripts

### Create Admin Account

The `createAdmin.js` script creates the initial admin account for the LMS system. This should only be run once during the initial setup of the application.

#### Usage

```bash
# Navigate to the server directory
cd server

# Run the script with Node.js
node scripts/createAdmin.js
```

This script will use environment variables from your `.env` file, otherwise it will use these default credentials:

- **Email**: admin@lms.com
- **Password**: Admin@123456
- **Name**: System Administrator

> **IMPORTANT**: For security reasons, please change the admin password immediately after the first login.

### Create Admin Account with Custom Parameters

The `createAdminWithParams.js` script allows you to create an admin account with custom credentials through an interactive prompt.

#### Usage

```bash
# Navigate to the server directory
cd server

# Run the script with Node.js
node scripts/createAdminWithParams.js
```

The script will prompt you to enter:
- Admin email (with environment variable as default if set)
- Admin name (with environment variable as default if set)
- Admin password (with environment variable as default if set)

### Create Admin Account with Command Line Arguments

The `createAdminCLI.js` script allows you to create an admin account with command line arguments, which is useful for automated setups or non-interactive environments.

#### Usage

```bash
# Navigate to the server directory
cd server

# Run the script with Node.js and provide all required parameters
node scripts/createAdminCLI.js --email admin@example.com --password SecurePass123! --name "Admin Name"
```

Parameters can be provided as command line arguments or environment variables:
- `--email` : Admin email address (or set ADMIN_EMAIL environment variable)
- `--password` : Admin password (or set ADMIN_PASSWORD environment variable)
- `--name` : Admin name (or set ADMIN_NAME environment variable)

#### Password Requirements

Admin passwords must meet the following requirements:
- At least 10 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@$!%*?&)

#### Customizing Admin Credentials

If you want to use different credentials, you can modify the admin variables in your `.env` file.

Note that the admin password must meet the following requirements:
- At least 10 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@$!%*?&)