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
      console.log(`ℹ️ Recruiter Demo user verified (ID: ${demoUserId})`);
    }

    // Seed Default Categories for Demo User
    const defaultCats = [
      { name: 'Work & Projects', color: '#3b82f6', icon: 'briefcase' },
      { name: 'Personal Life', color: '#10b981', icon: 'user' },
      { name: 'Health & Fitness', color: '#ec4899', icon: 'heart' },
      { name: 'Shopping & Groceries', color: '#f59e0b', icon: 'shopping-bag' },
    ];

    const catMap: Record<string, string> = {};
    for (const cat of defaultCats) {
      const res = await query(
        `INSERT INTO categories (user_id, name, color, icon)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, name) DO UPDATE SET color = EXCLUDED.color
         RETURNING id, name`,
        [demoUserId, cat.name, cat.color, cat.icon]
      );
      if (res.length > 0) {
        catMap[cat.name] = res[0].id;
      }
    }
    console.log('✅ Default categories verified.');

    // Seed Clean Productivity Todos
    const cleanTodos = [
      {
        title: 'Prepare Q3 product roadmap & feature proposal',
        description: 'Define key project milestones, user deliverables, and architectural requirements for upcoming sprint.',
        completed: false,
        priority: 'urgent',
        categoryName: 'Work & Projects',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        subtasks: ['Outline core milestone goals', 'Review resource requirements with team', 'Finalize executive presentation deck'],
      },
      {
        title: 'Design responsive mobile UI wireframes & tokens',
        description: 'Draft high-fidelity design tokens, dark mode variants, and smooth transition animations.',
        completed: true,
        priority: 'high',
        categoryName: 'Work & Projects',
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        subtasks: ['Header & sidebar navigation wireframes', 'Define semantic color variables & typography'],
      },
      {
        title: 'Weekly grocery restock & healthy meal prep',
        description: 'Buy fresh vegetables, avocados, organic milk, and prepare lunch meals for the week.',
        completed: false,
        priority: 'medium',
        categoryName: 'Shopping & Groceries',
        dueDate: new Date().toISOString(),
        subtasks: ['Avocados, spinach & tomatoes', 'Almond milk & organic eggs'],
      },
      {
        title: '30-minute evening cardio & stretching session',
        description: 'Run on treadmill or go for a brisk walk in the park followed by core stretching.',
        completed: false,
        priority: 'medium',
        categoryName: 'Health & Fitness',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        subtasks: ['Warm-up 5 mins', '20 min run'],
      },
      {
        title: 'Review quarterly financial investments and budget',
        description: 'Analyze budget allocations, track monthly expenses, and rebalance portfolio.',
        completed: false,
        priority: 'low',
        categoryName: 'Personal Life',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        subtasks: [],
      },
    ];

    // Clear old sample todos for demo user and insert clean ones
    await query(`DELETE FROM todos WHERE user_id = $1`, [demoUserId]);

    for (const t of cleanTodos) {
      const catId = catMap[t.categoryName] || null;
      const todoRes = await query(
        `INSERT INTO todos (user_id, category_id, title, description, completed, priority, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [demoUserId, catId, t.title, t.description, t.completed, t.priority, t.dueDate]
      );

      const todoId = todoRes[0].id;
      for (let i = 0; i < t.subtasks.length; i++) {
        await query(
          `INSERT INTO subtasks (todo_id, title, completed, position)
           VALUES ($1, $2, $3, $4)`,
          [todoId, t.subtasks[i], i === 0, i]
        );
      }
    }

    console.log('✅ Clean realistic productivity tasks seeded.');
    console.log('🎉 Neon Database re-initialization complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
