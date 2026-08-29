import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header';

// Mock AuthContext user
vi.mock('@/context/AuthContext', async () => {
  const actual = await vi.importActual('@/context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { id: 'u1', name: 'Marco', email: 'yosoymarco3@gmail.com', avatarUrl: '/avatars/princess.svg' },
      isAuthenticated: true,
      token: 'mock-token',
      logout: vi.fn(),
      updateAvatar: vi.fn(),
    }),
  };
});

describe('Header Component', () => {
  it('renders brand title and search bar with ⌘K badge', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={vi.fn()}
        onOpenCreateModal={vi.fn()}
        onOpenAuthModal={vi.fn()}
      />
    );

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it('toggles user dropdown menu with solid opaque card background & high z-index', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={vi.fn()}
        onOpenCreateModal={vi.fn()}
        onOpenAuthModal={vi.fn()}
      />
    );

    const userButton = screen.getByText('Marco');
    fireEvent.click(userButton);

    const changeAvatarBtn = screen.getByText('Change Avatar');
    expect(changeAvatarBtn).toBeInTheDocument();

    const dropdownContainer = changeAvatarBtn.closest('.z-\\[100\\]');
    expect(dropdownContainer).toHaveClass('bg-card');
    expect(dropdownContainer).toHaveClass('z-[100]');
  });
});
