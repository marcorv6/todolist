import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';
import { sendWelcomeEmail } from '@/lib/email';
import { isValidEmail, sanitizeString } from '@/lib/security/sanitize';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;
    let { name, email } = body;

    name = sanitizeString(name);
    email = sanitizeString(email).toLowerCase();

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const res = await query(
      `INSERT INTO users (name, email, password_hash, avatar_url)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar_url as "avatarUrl"`,
      [name, email, passwordHash, avatarUrl]
    );

    const user = res[0];
    const token = signToken({ userId: user.id, email: user.email });

    // Seed default categories for new user
    const defaultCats = [
      { name: 'Work & Projects', color: '#3b82f6', icon: 'briefcase' },
      { name: 'Personal Life', color: '#10b981', icon: 'user' },
      { name: 'Health & Fitness', color: '#ec4899', icon: 'heart' },
    ];
    for (const cat of defaultCats) {
      await query(
        `INSERT INTO categories (user_id, name, color, icon) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [user.id, cat.name, cat.color, cat.icon]
      );
    }

    // Trigger Welcome Email async
    sendWelcomeEmail({ name: user.name, email: user.email }).catch((e) =>
      console.error('Welcome email dispatch error:', e)
    );

    return NextResponse.json({ token, user }, { status: 201 });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
