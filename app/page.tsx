'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';
import {
  TodoItem,
  Category,
  TodoStats,
  TaskStatusFilter,
  Priority,
  SortByField,
  SortOrder,
  CreateTodoInput,
} from '@/types/todo';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { StatsWidget } from '@/components/StatsWidget';
import { TaskList } from '@/components/TaskList';
import { TaskModal } from '@/components/TaskModal';
import { AuthModal } from '@/components/AuthModal';
import { toast } from 'sonner';
import { mockApiClient } from '@/lib/api/mock-client';

export default function Home() {
  const { user, isAuthenticated, token, isLoading: isAuthLoading } = useAuth();

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  });

  const [activeStatus, setActiveStatus] = useState<TaskStatusFilter>('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortByField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Mandatory Auth Modal control when unauthenticated
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
      } else {
        setIsAuthModalOpen(false);
      }
    }
  }, [isAuthLoading, isAuthenticated]);

  // Load Data safely when user is authenticated
  const loadData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    try {
      const [todosRes, categoriesRes, statsRes] = await Promise.all([
        api.getTodos({
          status: activeStatus,
          priority: priorityFilter,
          categoryId: activeCategoryId,
          search: searchQuery,
          sortBy,
          sortOrder,
        }),
        api.getCategories(),
        api.getStats(),
      ]);

      setTodos(todosRes.data);
      setCategories(categoriesRes);
      setStats(statsRes);
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error('Data load error', err);
      }
    }
  }, [activeStatus, priorityFilter, activeCategoryId, searchQuery, sortBy, sortOrder, user, isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      loadData();
    }
  }, [loadData, isAuthLoading, isAuthenticated]);

  // Task Handlers
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await api.patchTodo(id, { completed: !currentStatus });
      toast.success(currentStatus ? 'Task marked active' : 'Task completed');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleSubtask = async (todoId: string, subtaskId: string, currentCompleted: boolean) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    const updatedSubtasks = todo.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !currentCompleted } : st
    );

    try {
      await api.updateTodo(todoId, { subtasks: updatedSubtasks });
      loadData();
    } catch {
      toast.error('Failed to update subtask');
    }
  };

  const handleSaveTask = async (input: CreateTodoInput, editingId?: string) => {
    try {
      if (editingId) {
        await api.updateTodo(editingId, input);
        toast.success('Task updated');
      } else {
        await api.createTodo(input);
        toast.success('Task created');
      }
      loadData();
    } catch {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.success('Task deleted');
      loadData();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  // Selection & Batch Actions
  const handleToggleSelectAll = () => {
    if (selectedIds.length === todos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(todos.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchComplete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.batchOperation({ action: 'complete', ids: selectedIds });
      toast.success(`Completed ${selectedIds.length} tasks`);
      setSelectedIds([]);
      loadData();
    } catch {
      toast.error('Batch complete failed');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.batchOperation({ action: 'delete', ids: selectedIds });
      toast.success(`Deleted ${selectedIds.length} tasks`);
      setSelectedIds([]);
      loadData();
    } catch {
      toast.error('Batch delete failed');
    }
  };

  const handleBatchSetCategory = async (categoryId: string | null) => {
    if (selectedIds.length === 0) return;
    try {
      await api.batchOperation({ action: 'setCategory', ids: selectedIds, categoryId });
      toast.success(`Category updated for ${selectedIds.length} tasks`);
      setSelectedIds([]);
      loadData();
    } catch {
      toast.error('Batch category update failed');
    }
  };

  // Category Handlers
  const handleCreateCategory = async (name: string, color: string) => {
    try {
      await api.createCategory({ name, color });
      toast.success(`Category "${name}" created`);
      loadData();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      if (activeCategoryId === id) setActiveCategoryId(null);
      toast.success('Category deleted');
      loadData();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  // Reset Mock Data
  const handleResetData = () => {
    if (confirm('Reset all todos and categories to default sample data?')) {
      mockApiClient.resetToDefaults();
      setSelectedIds([]);
      toast.success('Sample data restored');
      loadData();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* App Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => {
          setEditingTodo(null);
          setIsTaskModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Layout Body - Full Viewport Height & Width */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Console Panel */}
        <Sidebar
          activeStatus={activeStatus}
          onSelectStatus={setActiveStatus}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetData={handleResetData}
          counts={{
            all: stats.total,
            today: stats.pending,
            active: stats.pending,
            overdue: stats.overdue,
            completed: stats.completed,
          }}
        />

        {/* Console Workspace Main Data Section */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-background">
          {/* High-Contrast Stats Metric Bar */}
          <StatsWidget stats={stats} />

          {/* Task Data Table Section */}
          <TaskList
            todos={todos}
            categories={categories}
            selectedIds={selectedIds}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelect={handleToggleSelect}
            onToggleComplete={handleToggleComplete}
            onEdit={(todo) => {
              setEditingTodo(todo);
              setIsTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onToggleSubtask={handleToggleSubtask}
            onBatchComplete={handleBatchComplete}
            onBatchDelete={handleBatchDelete}
            onBatchSetCategory={handleBatchSetCategory}
          />
        </main>
      </div>

      {/* Task Form Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTask}
        categories={categories}
        editingTodo={editingTodo}
      />

      {/* Mandatory Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
