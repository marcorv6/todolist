'use client';

import React, { useState } from 'react';
import { TodoItem, Category, Priority } from '@/types/todo';
import { motion } from 'framer-motion';
import {
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface TaskCardProps {
  todo: TodoItem;
  categories: Category[];
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string, currentCompleted: boolean) => void;
}

export function TaskCard({
  todo,
  categories,
  isSelected,
  onToggleSelect,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
}: TaskCardProps) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const category = categories.find((c) => c.id === todo.categoryId);

  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;

  // Minimal priority indicator dot/strip
  const priorityDot: Record<Priority, { label: string; dotClass: string }> = {
    urgent: { label: 'P1', dotClass: 'bg-rose-500' },
    high: { label: 'P2', dotClass: 'bg-amber-500' },
    medium: { label: 'P3', dotClass: 'bg-blue-500' },
    low: { label: 'P4', dotClass: 'bg-zinc-400' },
  };

  // Due date status
  const getDueDateLabel = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const dueDate = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0 && !todo.completed) {
      return { text: 'Overdue', isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: 'Today', isToday: true };
    }
    if (diffDays === 1) {
      return { text: 'Tomorrow', isUpcoming: true };
    }
    return { text: dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  };

  const dueStatus = getDueDateLabel(todo.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`group relative border-b border-border/40 py-3 px-2 transition-colors ${
        isSelected ? 'bg-secondary/60' : 'hover:bg-secondary/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(todo.id)}
          className="mt-1 h-3.5 w-3.5 rounded border-border/70 text-foreground focus:ring-0 cursor-pointer"
        />

        {/* Completion Check Circle */}
        <button
          onClick={() => onToggleComplete(todo.id, todo.completed)}
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
            todo.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-muted-foreground/40 hover:border-foreground'
          }`}
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Dot */}
            <span
              className={`h-2 w-2 rounded-full ${priorityDot[todo.priority].dotClass}`}
              title={`Priority: ${todo.priority}`}
            />

            {/* Title */}
            <span
              className={`text-xs font-medium text-foreground transition-all ${
                todo.completed ? 'line-through text-muted-foreground/60' : ''
              }`}
            >
              {todo.title}
            </span>

            {/* Category Tag */}
            {category && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/80 font-mono">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            )}
          </div>

          {/* Description */}
          {todo.description && (
            <p className="text-[11px] text-muted-foreground/75 line-clamp-1">{todo.description}</p>
          )}

          {/* Meta & Subtasks indicator */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[10px] text-muted-foreground/65">
            {dueStatus && (
              <span
                className={`flex items-center gap-1 ${
                  dueStatus.isOverdue
                    ? 'text-rose-500 font-semibold'
                    : dueStatus.isToday
                    ? 'text-blue-500 font-semibold'
                    : ''
                }`}
              >
                {dueStatus.isOverdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                {dueStatus.text}
              </span>
            )}

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-1 font-mono">
                <Tag className="h-2.5 w-2.5 text-muted-foreground/50" />
                {todo.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Subtasks Accordion Trigger */}
            {totalSubtasks > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 font-mono hover:text-foreground transition-colors"
              >
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
                {showSubtasks ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>

          {/* Expandable Subtask List */}
          {totalSubtasks > 0 && showSubtasks && (
            <div className="mt-2 space-y-1 pl-2 border-l border-border/40">
              {todo.subtasks.map((st) => (
                <button
                  key={st.id}
                  onClick={() => onToggleSubtask(todo.id, st.id, st.completed)}
                  className="flex w-full items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  <div
                    className={`h-3 w-3 rounded border flex items-center justify-center shrink-0 ${
                      st.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border'
                    }`}
                  >
                    {st.completed && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span className={st.completed ? 'line-through text-muted-foreground/60' : ''}>
                    {st.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
            title="Edit Task"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-muted-foreground/60 hover:text-rose-500 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
