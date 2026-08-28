import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'dueDate';
    const sortOrder = (searchParams.get('sortOrder') || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let sql = `
      SELECT t.id, t.user_id as "userId", t.category_id as "categoryId", t.title, t.description,
             t.completed, t.priority, t.due_date as "dueDate", t.created_at as "createdAt", t.updated_at as "updatedAt"
      FROM todos t
      WHERE t.user_id = $1
    `;
    const params: any[] = [authUser.userId];
    let paramIdx = 2;

    // Filters
    const now = new Date();
    if (status === 'active') {
      sql += ` AND t.completed = false`;
    } else if (status === 'completed') {
      sql += ` AND t.completed = true`;
    } else if (status === 'overdue') {
      sql += ` AND t.completed = false AND t.due_date < $${paramIdx++}`;
      params.push(now.toISOString());
    } else if (status === 'today') {
      sql += ` AND DATE(t.due_date) = CURRENT_DATE`;
    }

    if (priority !== 'all') {
      sql += ` AND t.priority = $${paramIdx++}`;
      params.push(priority);
    }

    if (categoryId) {
      sql += ` AND t.category_id = $${paramIdx++}`;
      params.push(categoryId);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(t.title) LIKE $${paramIdx} OR LOWER(t.description) LIKE $${paramIdx})`;
      params.push(`%${search.trim().toLowerCase()}%`);
      paramIdx++;
    }

    // Sorting
    if (sortBy === 'priority') {
      sql += ` ORDER BY CASE t.priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END ${sortOrder}`;
    } else if (sortBy === 'createdAt') {
      sql += ` ORDER BY t.created_at ${sortOrder}`;
    } else if (sortBy === 'title') {
      sql += ` ORDER BY t.title ${sortOrder}`;
    } else {
      sql += ` ORDER BY t.due_date IS NULL, t.due_date ${sortOrder}`;
    }

    const todos = await query(sql, params);

    const todoIds = todos.map((t) => t.id);
    let subtasksMap: Record<string, any[]> = {};

    if (todoIds.length > 0) {
      const subtasks = await query(
        `SELECT id, todo_id as "todoId", title, completed, position FROM subtasks WHERE todo_id = ANY($1) ORDER BY position ASC`,
        [todoIds]
      );
      for (const st of subtasks) {
        if (!subtasksMap[st.todoId]) subtasksMap[st.todoId] = [];
        subtasksMap[st.todoId].push({ id: st.id, title: st.title, completed: st.completed });
      }
    }

    const result = todos.map((t) => ({
      ...t,
      subtasks: subtasksMap[t.id] || [],
    }));

    return NextResponse.json({ data: result, total: result.length });
  } catch (err: any) {
    console.error('GET Todos API Error:', err);
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
    const { title, description, priority, categoryId, dueDate, subtasks } = body;

    const cleanTitle = (title || '').trim();
    if (!cleanTitle) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const safePriority = validPriorities.includes(priority) ? priority : 'medium';

    const res = await query(
      `INSERT INTO todos (user_id, category_id, title, description, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id as "userId", category_id as "categoryId", title, description, completed, priority, due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt"`,
      [authUser.userId, categoryId || null, cleanTitle, (description || '').trim(), safePriority, dueDate || null]
    );

    const todo = res[0];
    let createdSubtasks: any[] = [];

    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      for (let i = 0; i < subtasks.length; i++) {
        const st = subtasks[i];
        if (st.title && st.title.trim()) {
          const stRes = await query(
            `INSERT INTO subtasks (todo_id, title, completed, position) VALUES ($1, $2, $3, $4) RETURNING id, title, completed`,
            [todo.id, st.title.trim(), st.completed || false, i]
          );
          createdSubtasks.push(stRes[0]);
        }
      }
    }

    return NextResponse.json({ ...todo, subtasks: createdSubtasks }, { status: 201 });
  } catch (err: any) {
    console.error('POST Todo API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
