import { query } from '../config/db.js';

async function checkSchema() {
  try {
    console.log('🔍 Checking current courses table schema...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Current courses table columns:');
    console.log('=' .repeat(60));
    
    if (result.rows.length === 0) {
      console.log('❌ No courses table found!');
    } else {
      result.rows.forEach(row => {
        console.log(`${row.column_name.padEnd(20)} | ${row.data_type.padEnd(15)} | ${row.is_nullable} | ${row.column_default || 'NULL'}`);
      });
    }
    
    console.log('=' .repeat(60));
    
    // Check if required columns exist
    const requiredColumns = ['approved_by', 'approved_at', 'level', 'price', 'is_published'];
    const existingColumns = result.rows.map(row => row.column_name);
    
    console.log('\n🔍 Missing columns check:');
    requiredColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      console.log(`${col.padEnd(20)} | ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
  
  process.exit(0);
}

checkSchema();