import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(
      `SELECT
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE completed = true)::int as completed,
         COUNT(*) FILTER (WHERE completed = false)::int as pending,
         COUNT(*) FILTER (WHERE completed = false AND due_date < NOW())::int as overdue
       FROM todos
       WHERE user_id = $1`,
      [authUser.userId]
    );

    const row = res[0] || { total: 0, completed: 0, pending: 0, overdue: 0 };
    const total = row.total || 0;
    const completed = row.completed || 0;
    const pending = row.pending || 0;
    const overdue = row.overdue || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      total,
      completed,
      pending,
      overdue,
      completionRate,
    });
  } catch (err: any) {
    console.error('Stats API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
