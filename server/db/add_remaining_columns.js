import { query } from '../config/db.js';

async function addRemainingColumns() {
  try {
    console.log('🔄 Adding remaining columns to courses table...');
    
    // Add the missing columns one by one
    const alterQueries = [
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE',
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS approved_by INTEGER REFERENCES users(id)',
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP'
    ];
    
    for (const query_text of alterQueries) {
      console.log(`Executing: ${query_text}`);
      await query(query_text);
    }
    
    console.log('✅ All missing columns added successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying columns...');
    const result = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      AND column_name IN ('is_published', 'approved_by', 'approved_at')
      ORDER BY column_name;
    `);
    
    console.log('Added columns:');
    result.rows.forEach(row => {
      console.log(`✅ ${row.column_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

addRemainingColumns();