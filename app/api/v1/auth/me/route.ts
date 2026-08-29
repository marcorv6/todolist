import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await query(
      `SELECT id, name, email, avatar_url as "avatarUrl" FROM users WHERE id = $1`,
      [authUser.userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (err: any) {
    console.error('Auth ME API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatarUrl } = await req.json();
    if (!avatarUrl) {
      return NextResponse.json({ error: 'avatarUrl is required' }, { status: 400 });
    }

    const updatedUsers = await query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2
       RETURNING id, name, email, avatar_url as "avatarUrl"`,
      [avatarUrl, authUser.userId]
    );

    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUsers[0]);
  } catch (err: any) {
    console.error('Auth PATCH ME API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
