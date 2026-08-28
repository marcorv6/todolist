'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Zap, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, loginAsDemoGuest, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginAsDemoGuest();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="border-b border-border/40 pb-3 space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              {tab === 'login' ? 'Welcome to TaskFlow' : 'Create Your Account'}
            </h2>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Please authenticate to access your productivity workspace.
          </p>
        </div>

        {/* 1-Click Recruiter Demo Button */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3.5 space-y-2.5 text-center">
          <p className="text-[11px] font-medium text-blue-300">Evaluating this portfolio project?</p>
          <button
            onClick={handleDemoLogin}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground py-2 text-xs font-semibold text-background shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>1-Click Recruiter Demo Login</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-semibold justify-center">
          <hr className="flex-1 border-border/40" />
          <span>Or sign in with email</span>
          <hr className="flex-1 border-border/40" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marco Romero"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
                required={tab === 'register'}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-secondary py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Footer Toggle Tab */}
        <div className="text-center pt-2 text-xs">
          {tab === 'login' ? (
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="font-semibold text-foreground underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="font-semibold text-foreground underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
