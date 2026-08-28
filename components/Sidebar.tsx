'use client';

import React, { useState } from 'react';
import { Category, TaskStatusFilter } from '@/types/todo';
import {
  ListTodo,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface SidebarProps {
  activeStatus: TaskStatusFilter;
  onSelectStatus: (status: TaskStatusFilter) => void;
  categories: Category[];
  activeCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onCreateCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onResetData: () => void;
  counts: {
    all: number;
    today: number;
    active: number;
    overdue: number;
    completed: number;
  };
}

export function Sidebar({
  activeStatus,
  onSelectStatus,
  categories,
  activeCategoryId,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
  onResetData,
  counts,
}: SidebarProps) {
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  const colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onCreateCategory(newCatName.trim(), newCatColor);
    setNewCatName('');
    setShowCategoryInput(false);
  };

  const navItems: { id: TaskStatusFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Tasks', icon: <ListTodo className="h-3.5 w-3.5" />, count: counts.all },
    { id: 'today', label: 'Today', icon: <Calendar className="h-3.5 w-3.5" />, count: counts.today },
    { id: 'active', label: 'Active', icon: <Clock className="h-3.5 w-3.5" />, count: counts.active },
    { id: 'overdue', label: 'Overdue', icon: <AlertCircle className="h-3.5 w-3.5 text-rose-500" />, count: counts.overdue },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />, count: counts.completed },
  ];

  return (
    <aside className="w-full shrink-0 border-r border-border/40 bg-background/50 p-4 md:w-56">
      {/* Primary Navigation Views */}
      <div className="space-y-0.5">
        <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Views
        </p>
        {navItems.map((item) => {
          const isActive = activeStatus === item.id && !activeCategoryId;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectCategory(null);
                onSelectStatus(item.id);
              }}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all ${
                isActive
                  ? 'bg-secondary font-semibold text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground/70">{item.count}</span>
            </button>
          );
        })}
      </div>

      <div className="my-5 border-t border-border/40" />

      {/* Categories Section */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between px-2 pb-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Categories
          </p>
          <button
            onClick={() => setShowCategoryInput(!showCategoryInput)}
            className="rounded p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
            title="Add Category"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Category Items */}
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <div key={cat.id} className="group relative flex items-center justify-between">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all ${
                    isActive
                      ? 'bg-secondary font-semibold text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/70">{cat.taskCount || 0}</span>
                </button>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="absolute right-1.5 hidden p-0.5 text-muted-foreground/60 hover:text-rose-500 group-hover:block transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        {showCategoryInput && (
          <form onSubmit={handleAddCategory} className="mt-2 rounded-md border border-border/60 bg-card p-2 space-y-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category name..."
              className="w-full rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCatColor(c)}
                    className={`h-3.5 w-3.5 rounded-full transition-transform ${
                      newCatColor === c ? 'scale-125 ring-1 ring-foreground' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowCategoryInput(false)}
                  className="px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="my-5 border-t border-border/40" />

      {/* Reset Data Button */}
      <div className="px-1">
        <button
          onClick={onResetData}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
}
