import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, isDemo } = body;

    if (!email && !isDemo) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const targetEmail = isDemo ? 'recruiter@demo.com' : email;
    const users = await query(
      `SELECT id, name, email, password_hash as "passwordHash", avatar_url as "avatarUrl"
       FROM users WHERE email = $1`,
      [targetEmail]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = users[0];

    // Verify password if not demo mode
    if (!isDemo && password) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    }

    const token = signToken({ userId: user.id, email: user.email });

    // Exclude passwordHash from response
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    return NextResponse.json({ token, user: sanitizedUser });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
