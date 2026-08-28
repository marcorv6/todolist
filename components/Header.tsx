'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Search, Plus, Sun, Moon, Check, LogOut, User as UserIcon, Zap, ChevronDown } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenAuthModal,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, loginAsDemoGuest } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs shadow-xs">
          <Check className="h-4 w-4 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">TaskFlow</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mx-6 max-w-sm flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/70">
          <Search className="h-3.5 w-3.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks or tags..."
          className="w-full rounded-full border border-border/60 bg-secondary/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        {/* User Account / Sign In */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 py-1 pl-1.5 pr-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-5 w-5 rounded-full" />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="font-medium max-w-[100px] truncate hidden sm:inline">{user.name}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg text-xs z-50">
                <div className="px-3 py-2 border-b border-border/40">
                  <p className="font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuthModal();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Switch Account</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Sign In</span>
          </button>
        )}

        {/* Create Task Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-all hover:opacity-90 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
