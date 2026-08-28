import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ids, categoryId } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
    }

    let affectedCount = 0;

    if (action === 'complete') {
      const res = await query(
        `UPDATE todos SET completed = true WHERE id = ANY($1) AND user_id = $2 RETURNING id`,
        [ids, authUser.userId]
      );
      affectedCount = res.length;
    } else if (action === 'uncomplete') {
      const res = await query(
        `UPDATE todos SET completed = false WHERE id = ANY($1) AND user_id = $2 RETURNING id`,
        [ids, authUser.userId]
      );
      affectedCount = res.length;
    } else if (action === 'delete') {
      const res = await query(
        `DELETE FROM todos WHERE id = ANY($1) AND user_id = $2 RETURNING id`,
        [ids, authUser.userId]
      );
      affectedCount = res.length;
    } else if (action === 'setCategory') {
      const res = await query(
        `UPDATE todos SET category_id = $1 WHERE id = ANY($2) AND user_id = $3 RETURNING id`,
        [categoryId || null, ids, authUser.userId]
      );
      affectedCount = res.length;
    }

    return NextResponse.json({ success: true, affectedCount });
  } catch (err: any) {
    console.error('Batch route error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
