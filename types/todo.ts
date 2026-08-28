export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatusFilter = 'all' | 'active' | 'completed' | 'overdue' | 'today';

export type SortByField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  taskCount?: number;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  categoryId?: string | null;
  tags?: string[];
  dueDate?: string | null; // ISO string
  subtasks: SubTask[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  categoryId?: string | null;
  tags?: string[];
  dueDate?: string | null;
  subtasks?: { id?: string; title: string; completed?: boolean }[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  categoryId?: string | null;
  tags?: string[];
  dueDate?: string | null;
  subtasks?: { id?: string; title: string; completed?: boolean }[];
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface BatchActionInput {
  action: 'complete' | 'uncomplete' | 'delete' | 'setCategory';
  ids: string[];
  categoryId?: string | null;
}

export interface FilterOptions {
  status: TaskStatusFilter;
  priority: 'all' | Priority;
  categoryId?: string | null;
  search?: string;
  sortBy: SortByField;
  sortOrder: SortOrder;
}
