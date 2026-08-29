import {
  TodoItem,
  Category,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
  BatchActionInput,
  FilterOptions,
  Priority,
} from '@/types/todo';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

const STORAGE_KEY_TODOS = 'todolist_items_v3';
const STORAGE_KEY_CATEGORIES = 'todolist_categories_v3';
const STORAGE_KEY_USER = 'todolist_auth_user_v1';
const STORAGE_KEY_TOKEN = 'todolist_auth_token_v1';

export const DEMO_USER: User = {
  id: 'usr-demo-1',
  name: 'Alex Dev',
  email: 'recruiter@demo.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

const DEFAULT_CATEGORIES: (Category & { userId: string })[] = [
  { id: 'cat-work', userId: DEMO_USER.id, name: 'Work & Projects', color: '#3b82f6', icon: 'briefcase' },
  { id: 'cat-personal', userId: DEMO_USER.id, name: 'Personal Life', color: '#10b981', icon: 'user' },
  { id: 'cat-health', userId: DEMO_USER.id, name: 'Health & Fitness', color: '#ec4899', icon: 'heart' },
  { id: 'cat-shopping', userId: DEMO_USER.id, name: 'Shopping & Groceries', color: '#f59e0b', icon: 'shopping-bag' },
];

const DEFAULT_TODOS: (TodoItem & { userId: string })[] = [
  {
    id: 'todo-1',
    userId: DEMO_USER.id,
    title: 'Prepare Q3 product roadmap & feature proposal',
    description: 'Define key project milestones, user deliverables, and architectural requirements for upcoming sprint.',
    completed: false,
    priority: 'urgent',
    categoryId: 'cat-work',
    tags: ['roadmap', 'planning', 'strategy'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Outline core milestone goals', completed: true },
      { id: 'sub-2', title: 'Review resource requirements with team', completed: true },
      { id: 'sub-3', title: 'Finalize executive presentation deck', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'todo-2',
    userId: DEMO_USER.id,
    title: 'Design responsive mobile UI wireframes & tokens',
    description: 'Draft high-fidelity design tokens, dark mode variants, and smooth transition animations.',
    completed: true,
    priority: 'high',
    categoryId: 'cat-work',
    tags: ['design', 'ui', 'mobile'],
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    subtasks: [
      { id: 'sub-4', title: 'Header & sidebar navigation wireframes', completed: true },
      { id: 'sub-5', title: 'Define semantic color variables & typography', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'todo-3',
    userId: DEMO_USER.id,
    title: 'Weekly grocery restock & healthy meal prep',
    description: 'Buy fresh vegetables, avocados, organic milk, and prepare lunch meals for the week.',
    completed: false,
    priority: 'medium',
    categoryId: 'cat-shopping',
    tags: ['groceries', 'home'],
    dueDate: new Date().toISOString(),
    subtasks: [
      { id: 'sub-7', title: 'Avocados, spinach & tomatoes', completed: true },
      { id: 'sub-8', title: 'Almond milk & organic eggs', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'todo-4',
    userId: DEMO_USER.id,
    title: '30-minute evening cardio & stretching session',
    description: 'Run on treadmill or go for a brisk walk in the park followed by core stretching.',
    completed: false,
    priority: 'medium',
    categoryId: 'cat-health',
    tags: ['fitness', 'routine'],
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    subtasks: [
      { id: 'sub-9', title: 'Warm-up 5 mins', completed: false },
      { id: 'sub-10', title: '20 min run', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'todo-5',
    userId: DEMO_USER.id,
    title: 'Review quarterly financial investments and budget',
    description: 'Analyze budget allocations, track monthly expenses, and rebalance portfolio.',
    completed: false,
    priority: 'low',
    categoryId: 'cat-personal',
    tags: ['finance', 'planning'],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class MockApiClient {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser()) return DEMO_USER;
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getCurrentToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(200);
    const user: User = {
      id: `usr-${Date.now()}`,
      email: credentials.email,
      name: credentials.email.split('@')[0] || 'User',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.email)}`,
    };
    const token = `jwt_mock_token_${Date.now()}`;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    }
    return { user, token };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await this.delay(250);
    const user: User = {
      id: `usr-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.email)}`,
    };
    const token = `jwt_mock_token_${Date.now()}`;
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    }
    return { user, token };
  }

  async loginAsDemoGuest(): Promise<AuthResponse> {
    await this.delay(150);
    const token = 'jwt_mock_token_demo_123';
    let userToUse = DEMO_USER;
    if (this.isBrowser()) {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email === DEMO_USER.email && parsed.avatarUrl) {
            userToUse = { ...DEMO_USER, avatarUrl: parsed.avatarUrl };
          }
        } catch {}
      }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userToUse));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    }
    return { user: userToUse, token };
  }

  async updateUserAvatar(avatarUrl: string): Promise<User> {
    await this.delay(100);
    const currentUser = this.getCurrentUser() || DEMO_USER;
    const updatedUser = { ...currentUser, avatarUrl };
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    }
    return updatedUser;
  }

  async logout(): Promise<void> {
    await this.delay(100);
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }

  private getStoredTodos(): (TodoItem & { userId: string })[] {
    if (!this.isBrowser()) return DEFAULT_TODOS;
    const data = localStorage.getItem(STORAGE_KEY_TODOS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(DEFAULT_TODOS));
      return DEFAULT_TODOS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_TODOS;
    }
  }

  private saveTodos(todos: (TodoItem & { userId: string })[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    }
  }

  private getStoredCategories(): (Category & { userId: string })[] {
    if (!this.isBrowser()) return DEFAULT_CATEGORIES;
    const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  private saveCategories(categories: (Category & { userId: string })[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    }
  }

  private delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getTodos(filters?: Partial<FilterOptions>): Promise<{ data: TodoItem[]; total: number }> {
    await this.delay();
    const currentUser = this.getCurrentUser();
    const userId = currentUser?.id || DEMO_USER.id;

    let todos = this.getStoredTodos().filter((t) => t.userId === userId);
    const now = new Date();

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          todos = todos.filter((t) => !t.completed);
        } else if (filters.status === 'completed') {
          todos = todos.filter((t) => t.completed);
        } else if (filters.status === 'overdue') {
          todos = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < now);
        } else if (filters.status === 'today') {
          todos = todos.filter((t) => {
            if (!t.dueDate) return false;
            const d = new Date(t.dueDate);
            return d.toDateString() === now.toDateString();
          });
        }
      }

      if (filters.priority && filters.priority !== 'all') {
        todos = todos.filter((t) => t.priority === filters.priority);
      }

      if (filters.categoryId) {
        todos = todos.filter((t) => t.categoryId === filters.categoryId);
      }

      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        todos = todos.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query)) ||
            (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      }

      const sortBy = filters.sortBy || 'dueDate';
      const sortOrder = filters.sortOrder || 'asc';
      const priorityWeight: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

      todos.sort((a, b) => {
        let valA: any = a[sortBy as keyof TodoItem];
        let valB: any = b[sortBy as keyof TodoItem];

        if (sortBy === 'priority') {
          valA = priorityWeight[a.priority] || 0;
          valB = priorityWeight[b.priority] || 0;
        } else if (sortBy === 'dueDate') {
          valA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          valB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        } else if (sortBy === 'createdAt') {
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return { data: todos, total: todos.length };
  }

  async getTodoById(id: string): Promise<TodoItem> {
    await this.delay();
    const todos = this.getStoredTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error(`Todo with ID ${id} not found`);
    return todo;
  }

  async createTodo(input: CreateTodoInput): Promise<TodoItem> {
    await this.delay();
    const currentUser = this.getCurrentUser();
    const userId = currentUser?.id || DEMO_USER.id;
    const todos = this.getStoredTodos();

    const newTodo: TodoItem & { userId: string } = {
      id: `todo-${Date.now()}`,
      userId,
      title: input.title,
      description: input.description || '',
      completed: false,
      priority: input.priority || 'medium',
      categoryId: input.categoryId || null,
      tags: input.tags || [],
      dueDate: input.dueDate || null,
      subtasks: (input.subtasks || []).map((sub, index) => ({
        id: sub.id || `sub-${Date.now()}-${index}`,
        title: sub.title,
        completed: sub.completed || false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTodo, ...todos];
    this.saveTodos(updated);
    return newTodo;
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<TodoItem> {
    await this.delay();
    const todos = this.getStoredTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Todo with ID ${id} not found`);

    const existing = todos[index];
    const updated: TodoItem & { userId: string } = {
      ...existing,
      ...input,
      subtasks: input.subtasks
        ? input.subtasks.map((st, i) => ({
            id: st.id || `sub-${Date.now()}-${i}`,
            title: st.title,
            completed: st.completed || false,
          }))
        : existing.subtasks,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    this.saveTodos(todos);
    return updated;
  }

  async patchTodo(id: string, patch: Partial<TodoItem>): Promise<TodoItem> {
    await this.delay();
    return this.updateTodo(id, patch);
  }

  async deleteTodo(id: string): Promise<{ success: boolean; id: string }> {
    await this.delay();
    const todos = this.getStoredTodos();
    const filtered = todos.filter((t) => t.id !== id);
    this.saveTodos(filtered);
    return { success: true, id };
  }

  async batchOperation(input: BatchActionInput): Promise<{ success: boolean; affectedCount: number }> {
    await this.delay();
    const todos = this.getStoredTodos();
    let affected = 0;

    const updatedTodos = todos.map((t) => {
      if (!input.ids.includes(t.id)) return t;
      affected++;

      if (input.action === 'complete') {
        return { ...t, completed: true, updatedAt: new Date().toISOString() };
      }
      if (input.action === 'uncomplete') {
        return { ...t, completed: false, updatedAt: new Date().toISOString() };
      }
      if (input.action === 'setCategory') {
        return { ...t, categoryId: input.categoryId || null, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    if (input.action === 'delete') {
      const finalTodos = todos.filter((t) => !input.ids.includes(t.id));
      this.saveTodos(finalTodos);
      return { success: true, affectedCount: input.ids.length };
    }

    this.saveTodos(updatedTodos);
    return { success: true, affectedCount: affected };
  }

  async getCategories(): Promise<Category[]> {
    await this.delay();
    const currentUser = this.getCurrentUser();
    const userId = currentUser?.id || DEMO_USER.id;
    const categories = this.getStoredCategories().filter((c) => c.userId === userId);
    const todos = this.getStoredTodos().filter((t) => t.userId === userId);

    return categories.map((cat) => ({
      ...cat,
      taskCount: todos.filter((t) => t.categoryId === cat.id && !t.completed).length,
    }));
  }

  async createCategory(input: { name: string; color: string; icon?: string }): Promise<Category> {
    await this.delay();
    const currentUser = this.getCurrentUser();
    const userId = currentUser?.id || DEMO_USER.id;
    const categories = this.getStoredCategories();

    const newCategory: Category & { userId: string } = {
      id: `cat-${Date.now()}`,
      userId,
      name: input.name,
      color: input.color,
      icon: input.icon || 'folder',
      taskCount: 0,
    };
    const updated = [...categories, newCategory];
    this.saveCategories(updated);
    return newCategory;
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    await this.delay();
    const categories = this.getStoredCategories();
    const filtered = categories.filter((c) => c.id !== id);
    this.saveCategories(filtered);

    const todos = this.getStoredTodos();
    const updatedTodos = todos.map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t));
    this.saveTodos(updatedTodos);

    return { success: true };
  }

  async getStats(): Promise<TodoStats> {
    await this.delay();
    const currentUser = this.getCurrentUser();
    const userId = currentUser?.id || DEMO_USER.id;
    const todos = this.getStoredTodos().filter((t) => t.userId === userId);
    const now = new Date();

    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
    };
  }

  resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(DEFAULT_TODOS));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USER));
      localStorage.setItem(STORAGE_KEY_TOKEN, 'jwt_mock_token_demo_123');
    }
  }
}

export const mockApiClient = new MockApiClient();
