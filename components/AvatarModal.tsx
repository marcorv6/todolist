'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AVATAR_OPTIONS, AvatarOption } from '@/constants/avatars';
import { X, Check, Sparkles } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const { user, updateAvatar } = useAuth();
  const [selectedUrl, setSelectedUrl] = useState<string>(user?.avatarUrl || AVATAR_OPTIONS[0].url);

  if (!isOpen) return null;

  const handleSave = () => {
    updateAvatar(selectedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Select Your Avatar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected Preview */}
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
          <img src={selectedUrl} alt="Selected Avatar" className="h-12 w-12 rounded-full border border-border/80 bg-background" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              {AVATAR_OPTIONS.find((a) => a.url === selectedUrl)?.name || 'Custom Avatar'}
            </p>
            <p className="text-[10px] text-muted-foreground">Click any avatar below to apply to your profile</p>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
          {AVATAR_OPTIONS.map((avatar: AvatarOption) => {
            const isSelected = selectedUrl === avatar.url;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedUrl(avatar.url)}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all ${
                  isSelected
                    ? 'border-foreground bg-secondary/70 ring-1 ring-foreground'
                    : 'border-border/60 bg-background hover:bg-secondary/40 hover:border-border'
                }`}
              >
                <div className="relative">
                  <img src={avatar.url} alt={avatar.name} className="h-10 w-10 rounded-full" />
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight text-foreground truncate max-w-full">
                  {avatar.name}
                </span>
                {avatar.badge && (
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                    {avatar.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
