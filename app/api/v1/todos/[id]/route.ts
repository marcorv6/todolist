import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const todos = await query(
      `SELECT id, user_id as "userId", category_id as "categoryId", title, description, completed, priority, due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt"
       FROM todos WHERE id = $1 AND user_id = $2`,
      [id, authUser.userId]
    );

    if (todos.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const subtasks = await query(
      `SELECT id, title, completed FROM subtasks WHERE todo_id = $1 ORDER BY position ASC`,
      [id]
    );

    return NextResponse.json({ ...todos[0], subtasks });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, completed, priority, categoryId, dueDate, subtasks } = body;

    const existing = await query(`SELECT id FROM todos WHERE id = $1 AND user_id = $2`, [id, authUser.userId]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const res = await query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           priority = COALESCE($4, priority),
           category_id = $5,
           due_date = $6
       WHERE id = $7 AND user_id = $8
       RETURNING id, user_id as "userId", category_id as "categoryId", title, description, completed, priority, due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt"`,
      [title, description, completed, priority, categoryId !== undefined ? categoryId : null, dueDate !== undefined ? dueDate : null, id, authUser.userId]
    );

    // Sync subtasks
    if (subtasks && Array.isArray(subtasks)) {
      await query(`DELETE FROM subtasks WHERE todo_id = $1`, [id]);
      for (let i = 0; i < subtasks.length; i++) {
        const st = subtasks[i];
        await query(
          `INSERT INTO subtasks (todo_id, title, completed, position) VALUES ($1, $2, $3, $4)`,
          [id, st.title, st.completed || false, i]
        );
      }
    }

    const updatedSubtasks = await query(`SELECT id, title, completed FROM subtasks WHERE todo_id = $1 ORDER BY position ASC`, [id]);
    return NextResponse.json({ ...res[0], subtasks: updatedSubtasks });
  } catch (err: any) {
    console.error('PUT Todo error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await query(`SELECT id FROM todos WHERE id = $1 AND user_id = $2`, [id, authUser.userId]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (body.completed !== undefined) {
      updates.push(`completed = $${idx++}`);
      values.push(body.completed);
    }
    if (body.title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(body.title);
    }
    if (body.priority !== undefined) {
      updates.push(`priority = $${idx++}`);
      values.push(body.priority);
    }

    values.push(id, authUser.userId);

    const res = await query(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++}
       RETURNING id, user_id as "userId", category_id as "categoryId", title, description, completed, priority, due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    const subtasks = await query(`SELECT id, title, completed FROM subtasks WHERE todo_id = $1 ORDER BY position ASC`, [id]);
    return NextResponse.json({ ...res[0], subtasks });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const res = await query(`DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id`, [id, authUser.userId]);

    if (res.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
