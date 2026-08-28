import fs from 'fs';
import path from 'path';
import pool, { query } from '../lib/db/index';
import bcrypt from 'bcryptjs';

async function initDatabase() {
  console.log('⚡ Initializing Neon PostgreSQL Database Schema...');

  const schemaPath = path.join(__dirname, '../database/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    // Execute DDL schema script
    await query(sql);
    console.log('✅ Database tables, indexes, and triggers created successfully.');

    // Seed Recruiter Demo User
    const demoEmail = 'recruiter@demo.com';
    const existingUsers = await query(`SELECT id FROM users WHERE email = $1`, [demoEmail]);

    let demoUserId: string;
    if (existingUsers.length === 0) {
      const passwordHash = await bcrypt.hash('demo12345', 10);
      const res = await query(
        `INSERT INTO users (email, password_hash, name, avatar_url)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [demoEmail, passwordHash, 'Alex Dev (Recruiter Demo)', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex']
      );
      demoUserId = res[0].id;
      console.log(`✅ Seeded Recruiter Demo user (ID: ${demoUserId})`);
    } else {
      demoUserId = existingUsers[0].id;
      console.log(`ℹ️ Recruiter Demo user already exists (ID: ${demoUserId})`);
    }

    // Seed Default Categories for Demo User
    const defaultCats = [
      { name: 'Work & Projects', color: '#3b82f6', icon: 'briefcase' },
      { name: 'Personal Life', color: '#10b981', icon: 'user' },
      { name: 'Health & Fitness', color: '#ec4899', icon: 'heart' },
      { name: 'Shopping & Groceries', color: '#f59e0b', icon: 'shopping-bag' },
    ];

    for (const cat of defaultCats) {
      await query(
        `INSERT INTO categories (user_id, name, color, icon)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, name) DO NOTHING`,
        [demoUserId, cat.name, cat.color, cat.icon]
      );
    }
    console.log('✅ Default categories verified.');

    console.log('🎉 Neon Database initialization complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
