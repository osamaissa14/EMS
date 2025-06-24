import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function addQuizColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Add is_published column to quizzes table
    console.log('Adding is_published column to quizzes table...');
    await client.query(`
      ALTER TABLE quizzes 
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ is_published column added to quizzes table');

    // Verify the column was added
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes' AND column_name = 'is_published'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verified: is_published column exists in quizzes table');
    } else {
      console.log('❌ Error: is_published column was not added');
    }

  } catch (error) {
    console.error('Error adding quiz columns:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

addQuizColumns();