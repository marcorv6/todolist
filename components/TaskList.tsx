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
    <div className="space-y-3 font-mono">
      {/* Controls & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 text-xs shadow-xs">
        {/* Bulk select checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            disabled={todos.length === 0}
            className="h-3.5 w-3.5 rounded border-border/70 text-foreground focus:ring-0 cursor-pointer disabled:opacity-40 bg-background"
          />
          <span className="text-[11px] text-muted-foreground font-semibold">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select All'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as any)}
              className="bg-transparent text-[11px] text-muted-foreground focus:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-card text-foreground">All Priorities</option>
              <option value="urgent" className="bg-card text-foreground">P1 - Urgent</option>
              <option value="high" className="bg-card text-foreground">P2 - High</option>
              <option value="medium" className="bg-card text-foreground">P3 - Medium</option>
              <option value="low" className="bg-card text-foreground">P4 - Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortByField)}
              className="bg-transparent text-[11px] text-muted-foreground focus:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="dueDate" className="bg-card text-foreground">Due Date</option>
              <option value="priority" className="bg-card text-foreground">Priority</option>
              <option value="createdAt" className="bg-card text-foreground">Created</option>
              <option value="title" className="bg-card text-foreground">Title</option>
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
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-foreground p-2.5 text-xs text-background shadow-lg"
          >
            <span className="font-semibold text-[11px]">
              {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onBatchComplete}
                className="flex items-center gap-1 rounded-md bg-background/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-background/30 transition-colors"
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
                className="rounded-md bg-background/20 px-2.5 py-1 text-[11px] text-background focus:outline-none cursor-pointer font-semibold"
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
                className="flex items-center gap-1 rounded-md bg-rose-500/90 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-600 transition-colors"
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
        <div className="py-12 text-center rounded-xl border border-border/40 bg-card/30">
          <p className="text-xs text-muted-foreground/60 font-mono">No tasks match your filter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <TaskCard
                key={todo.id}
                todo={todo}
                category={categories.find((c) => c.id === todo.categoryId)}
                isSelected={selectedIds.includes(todo.id)}
                onToggleSelect={() => onToggleSelect(todo.id)}
                onToggleComplete={() => onToggleComplete(todo.id, todo.completed)}
                onEdit={() => onEdit(todo)}
                onDelete={() => onDelete(todo.id)}
                onToggleSubtask={(subtaskId, currentCompleted) =>
                  onToggleSubtask(todo.id, subtaskId, currentCompleted)
                }
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
