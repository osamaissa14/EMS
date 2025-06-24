import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function verifyQuizColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if is_published column exists
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes' AND column_name = 'is_published'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ is_published column exists in quizzes table');
    } else {
      console.log('❌ is_published column does NOT exist in quizzes table');
    }

    // Show all columns in quizzes table
    const allColumns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'quizzes'
      ORDER BY ordinal_position
    `);
    
    console.log('\nAll columns in quizzes table:');
    allColumns.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

  } catch (error) {
    console.error('Error verifying quiz columns:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

verifyQuizColumns();