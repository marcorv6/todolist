import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskModal } from '@/components/TaskModal';

describe('TaskModal Component', () => {
  const mockCategories = [
    { id: 'cat-1', name: 'Work', color: '#3b82f6' },
  ];

  it('renders task modal fields and priority buttons cleanly', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={mockCategories}
      />
    );

    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByText('P1 - Urgent')).toBeInTheDocument();
    expect(screen.getByText('P2 - High')).toBeInTheDocument();
    expect(screen.getByText('P3 - Medium')).toBeInTheDocument();
    expect(screen.getByText('P4 - Low')).toBeInTheDocument();
  });

  it('allows filling title and submitting form', () => {
    const onSave = vi.fn();
    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={onSave}
        categories={mockCategories}
      />
    );

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    fireEvent.change(titleInput, { target: { value: 'Test Task Creation' } });

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Task Creation',
        priority: 'medium',
      }),
      undefined
    );
  });
});
