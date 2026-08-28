'use client';

import React, { useState, useEffect } from 'react';
import { TodoItem, Category, Priority, CreateTodoInput } from '@/types/todo';
import { X, Trash2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateTodoInput, editingId?: string) => void;
  categories: Category[];
  editingTodo?: TodoItem | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  categories,
  editingTodo,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<{ id?: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority);
      setCategoryId(editingTodo.categoryId || '');
      setDueDate(editingTodo.dueDate ? editingTodo.dueDate.substring(0, 16) : '');
      setTags(editingTodo.tags || []);
      setSubtasks(editingTodo.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
      setTags([]);
      setSubtasks([]);
    }
  }, [editingTodo, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: categoryId || null,
        tags,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        subtasks,
      },
      editingTodo?.id
    );

    onClose();
  };

  const priorityOptions: { value: Priority; label: string; activeClass: string }[] = [
    { value: 'urgent', label: 'P1 - Urgent', activeClass: 'bg-rose-500 text-white' },
    { value: 'high', label: 'P2 - High', activeClass: 'bg-amber-500 text-white' },
    { value: 'medium', label: 'P3 - Medium', activeClass: 'bg-blue-500 text-white' },
    { value: 'low', label: 'P4 - Low', activeClass: 'bg-zinc-600 text-white' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            {editingTodo ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              Notes / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes or breakdown..."
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
            />
          </div>

          {/* Priority & Category Pickers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-1">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`rounded py-1 text-[10px] font-semibold transition-all ${
                      priority === opt.value
                        ? opt.activeClass
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              Subtasks ({subtasks.length})
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a subtask item..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                  Add
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1 rounded-md border border-border/50 bg-secondary/30 p-2">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{st.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(i)}
                        className="text-muted-foreground/60 hover:text-rose-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-muted-foreground mb-1">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground hover:bg-accent"
              >
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
            >
              {editingTodo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
