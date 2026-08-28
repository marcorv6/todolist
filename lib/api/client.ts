import { mockApiClient } from './mock-client';
import { httpClient } from './http-client';
import {
  TodoItem,
  Category,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
  BatchActionInput,
  FilterOptions,
} from '@/types/todo';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

export interface ApiClientInterface {
  getCurrentUser(): User | null;
  getCurrentToken(): string | null;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  loginAsDemoGuest(): Promise<AuthResponse>;
  logout(): Promise<void>;

  getTodos(filters?: Partial<FilterOptions>): Promise<{ data: TodoItem[]; total: number }>;
  getTodoById(id: string): Promise<TodoItem>;
  createTodo(input: CreateTodoInput): Promise<TodoItem>;
  updateTodo(id: string, input: UpdateTodoInput): Promise<TodoItem>;
  patchTodo(id: string, patch: Partial<TodoItem>): Promise<TodoItem>;
  deleteTodo(id: string): Promise<{ success: boolean; id: string }>;
  batchOperation(input: BatchActionInput): Promise<{ success: boolean; affectedCount: number }>;
  getCategories(): Promise<Category[]>;
  createCategory(input: { name: string; color: string; icon?: string }): Promise<Category>;
  deleteCategory(id: string): Promise<{ success: boolean }>;
  getStats(): Promise<TodoStats>;
  resetToDefaults?(): void;
}

export const api: ApiClientInterface = USE_MOCK ? mockApiClient : httpClient;
