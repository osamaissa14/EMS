import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function addAssignmentColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // First, rename deadline to due_date
    console.log('Renaming deadline column to due_date...');
    await client.query(`
      ALTER TABLE assignments 
      RENAME COLUMN deadline TO due_date
    `);
    console.log('✅ Renamed deadline to due_date');

    // Rename max_points to max_score
    console.log('Renaming max_points column to max_score...');
    await client.query(`
      ALTER TABLE assignments 
      RENAME COLUMN max_points TO max_score
    `);
    console.log('✅ Renamed max_points to max_score');

    // Add is_published column
    console.log('Adding is_published column...');
    await client.query(`
      ALTER TABLE assignments 
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Added is_published column');

    // Add file_requirements column
    console.log('Adding file_requirements column...');
    await client.query(`
      ALTER TABLE assignments 
      ADD COLUMN IF NOT EXISTS file_requirements TEXT
    `);
    console.log('✅ Added file_requirements column');

    // Verify the changes
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'assignments'
      ORDER BY ordinal_position
    `);
    
    console.log('\nAll columns in assignments table:');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

  } catch (error) {
    console.error('Error updating assignment columns:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

addAssignmentColumns();