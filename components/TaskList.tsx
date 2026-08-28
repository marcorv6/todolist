'use client';

import React from 'react';
import { TodoItem, Category, Priority, SortByField, SortOrder } from '@/types/todo';
import { TaskCard } from './TaskCard';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Trash2,
  ArrowUpDown,
  Filter,
  CheckSquare,
} from 'lucide-react';

interface TaskListProps {
  todos: TodoItem[];
  categories: Category[];
  selectedIds: string[];
  priorityFilter: 'all' | Priority;
  onPriorityFilterChange: (p: 'all' | Priority) => void;
  sortBy: SortByField;
  onSortByChange: (s: SortByField) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string, currentCompleted: boolean) => void;
  onBatchComplete: () => void;
  onBatchDelete: () => void;
  onBatchSetCategory: (categoryId: string | null) => void;
}

export function TaskList({
  todos,
  categories,
  selectedIds,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onToggleSelectAll,
  onToggleSelect,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
  onBatchComplete,
  onBatchDelete,
  onBatchSetCategory,
}: TaskListProps) {
  const isAllSelected = todos.length > 0 && selectedIds.length === todos.length;

  return (
    <div className="space-y-3">
      {/* Controls & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-2 text-xs">
        {/* Bulk select checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            disabled={todos.length === 0}
            className="h-3.5 w-3.5 rounded border-border/70 text-foreground focus:ring-0 cursor-pointer disabled:opacity-40"
          />
          <span className="text-[11px] text-muted-foreground/70">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3 text-muted-foreground/60" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as any)}
              className="bg-transparent text-[11px] text-muted-foreground focus:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">P1 - Urgent</option>
              <option value="high">P2 - High</option>
              <option value="medium">P3 - Medium</option>
              <option value="low">P4 - Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground/60" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortByField)}
              className="bg-transparent text-[11px] text-muted-foreground focus:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              className="font-mono text-[10px] uppercase text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Sort Order"
            >
              ({sortOrder})
            </button>
          </div>
        </div>
      </div>

      {/* Floating Batch Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-foreground p-2.5 text-xs text-background shadow-md"
          >
            <span className="font-medium text-[11px]">
              {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onBatchComplete}
                className="flex items-center gap-1 rounded bg-background/20 px-2 py-1 text-[11px] font-medium hover:bg-background/30 transition-colors"
              >
                <CheckCircle className="h-3 w-3" />
                <span>Complete</span>
              </button>

              <select
                onChange={(e) => {
                  const val = e.target.value;
                  onBatchSetCategory(val === 'none' ? null : val);
                }}
                defaultValue=""
                className="rounded bg-background/20 px-2 py-1 text-[11px] text-background focus:outline-none cursor-pointer"
              >
                <option value="" disabled className="text-foreground">
                  Move to...
                </option>
                <option value="none" className="text-foreground">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-foreground">
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={onBatchDelete}
                className="flex items-center gap-1 rounded bg-rose-500/80 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List Items */}
      {todos.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xs text-muted-foreground/60">No tasks match your filter.</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <TaskCard
                key={todo.id}
                todo={todo}
                categories={categories}
                isSelected={selectedIds.includes(todo.id)}
                onToggleSelect={onToggleSelect}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
