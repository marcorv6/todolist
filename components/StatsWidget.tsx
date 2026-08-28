'use client';

import React from 'react';
import { TodoStats } from '@/types/todo';

interface StatsWidgetProps {
  stats: TodoStats;
}

export function StatsWidget({ stats }: StatsWidgetProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4 text-xs">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-muted-foreground/70">Total: </span>
          <span className="font-semibold font-mono text-foreground">{stats.total}</span>
        </div>
        <div>
          <span className="text-muted-foreground/70">Active: </span>
          <span className="font-semibold font-mono text-foreground">{stats.pending}</span>
        </div>
        {stats.overdue > 0 && (
          <div>
            <span className="text-rose-500 font-medium">Overdue: </span>
            <span className="font-semibold font-mono text-rose-500">{stats.overdue}</span>
          </div>
        )}
        <div>
          <span className="text-muted-foreground/70">Done: </span>
          <span className="font-semibold font-mono text-foreground">{stats.completed}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="flex items-center gap-3 min-w-[140px]">
        <div className="h-1 flex-1 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <span className="font-mono text-[11px] font-semibold text-muted-foreground">
          {stats.completionRate}%
        </span>
      </div>
    </div>
  );
}
