'use client';

import React, { useState } from 'react';
import { TodoItem, Category, Priority } from '@/types/todo';
import {
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit2,
  Trash2,
  Tag,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  todo: TodoItem;
  category?: Category;
  isSelected: boolean;
  onToggleSelect: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string, currentCompleted: boolean) => void;
}

export function TaskCard({
  todo,
  category,
  isSelected,
  onToggleSelect,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityConfig: Record<Priority, { label: string; bg: string; text: string; border: string }> = {
    urgent: { label: 'P1 Urgent', bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
    high: { label: 'P2 High', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
    medium: { label: 'P3 Medium', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    low: { label: 'P4 Low', bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20' },
  };

  const isOverdue =
    !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  const completedSubtasksCount = todo.subtasks.filter((st) => st.completed).length;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'border-border/40 bg-card/40 opacity-75'
          : isSelected
          ? 'border-foreground/30 bg-secondary/60'
          : 'border-border/60 bg-card hover:border-border hover:bg-secondary/30'
      }`}
    >
      {/* Primary Row Content */}
      <div className="flex items-center justify-between p-3 sm:p-4 gap-3">
        {/* Selection Checkbox & Toggle Status Checkbox */}
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-3.5 w-3.5 rounded border-border text-foreground focus:ring-1 focus:ring-foreground/20 bg-background"
          />

          <button
            onClick={onToggleComplete}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
              todo.completed
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-border/80 bg-background hover:border-foreground/40'
            }`}
          >
            {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
          </button>
        </div>

        {/* Task Core Metadata */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-semibold tracking-tight ${
                todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {todo.title}
            </span>

            {/* Category Pill */}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono text-muted-foreground border border-border/40">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            )}

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                priorityConfig[todo.priority].bg
              } ${priorityConfig[todo.priority].text} ${priorityConfig[todo.priority].border}`}
            >
              {priorityConfig[todo.priority].label}
            </span>

            {/* Overdue Badge */}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-mono border border-rose-500/20">
                <AlertCircle className="h-3 w-3" /> Overdue
              </span>
            )}
          </div>

          {/* Description Snippet */}
          {todo.description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-1 font-light">
              {todo.description}
            </p>
          )}

          {/* Bottom Indicators (Due Date, Subtasks, Tags) */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-muted-foreground/70">
            {todo.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground/60" />
                {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}

            {todo.subtasks.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Clock className="h-3 w-3" />
                <span>{completedSubtasksCount}/{todo.subtasks.length} subtasks</span>
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground/60" />
                <span>{todo.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Row Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Edit task"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Subtasks Checklist Accordion */}
      {isExpanded && todo.subtasks.length > 0 && (
        <div className="border-t border-border/40 bg-secondary/20 p-3 sm:px-4 space-y-2 rounded-b-xl">
          <div className="text-[10px] font-mono font-bold uppercase text-muted-foreground/70">
            Subtask Checklist ({completedSubtasksCount}/{todo.subtasks.length})
          </div>
          <div className="space-y-1.5">
            {todo.subtasks.map((st) => (
              <label
                key={st.id}
                className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:opacity-80 transition-opacity"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => onToggleSubtask(st.id, st.completed)}
                  className="h-3.5 w-3.5 rounded border-border text-foreground focus:ring-1 focus:ring-foreground/20 bg-background"
                />
                <span className={st.completed ? 'line-through text-muted-foreground' : ''}>
                  {st.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
