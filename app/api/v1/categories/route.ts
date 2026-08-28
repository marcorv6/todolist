import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await query(
      `SELECT c.id, c.name, c.color, c.icon,
              COUNT(t.id) FILTER (WHERE t.completed = false) as "taskCount"
       FROM categories c
       LEFT JOIN todos t ON t.category_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.name ASC`,
      [authUser.userId]
    );

    const result = categories.map((c) => ({
      ...c,
      taskCount: parseInt(c.taskCount || '0', 10),
    }));

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('GET Categories error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, color, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name required' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO categories (user_id, name, color, icon)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, color, icon`,
      [authUser.userId, name.trim(), color || '#3b82f6', icon || 'folder']
    );

    return NextResponse.json({ ...res[0], taskCount: 0 }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
