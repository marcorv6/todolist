'use client';

import React from 'react';
import { TodoStats } from '@/types/todo';
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp } from 'lucide-react';

interface StatsWidgetProps {
  stats: TodoStats;
}

export function StatsWidget({ stats }: StatsWidgetProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono">
      {/* Total Tasks */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3.5 shadow-xs">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total Tasks</p>
          <p className="text-xl font-extrabold text-foreground">{stats.total}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <ListTodo className="h-4 w-4" />
        </div>
      </div>

      {/* Active Tasks */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3.5 shadow-xs">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-blue-500 font-semibold">Active</p>
          <p className="text-xl font-extrabold text-blue-500">{stats.pending}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3.5 shadow-xs">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-rose-500 font-semibold">Overdue</p>
          <p className="text-xl font-extrabold text-rose-500">{stats.overdue}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <AlertCircle className="h-4 w-4" />
        </div>
      </div>

      {/* Completion Meter */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3.5 shadow-xs">
        <div className="space-y-1 flex-1 pr-2">
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold">
            <span className="text-emerald-500">Progress</span>
            <span className="text-emerald-500">{stats.completionRate}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
