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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card text-card-foreground p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight text-foreground font-mono">
              Choose Avatar
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
        <div className="flex items-center justify-center p-3">
          <img
            src={selectedUrl}
            alt="Selected Avatar Preview"
            className="h-20 w-20 rounded-full border-2 border-foreground/30 bg-background shadow-md transition-all"
          />
        </div>

        {/* Minimalist Avatar Grid */}
        <div className="grid grid-cols-3 gap-3 p-1">
          {AVATAR_OPTIONS.map((avatar: AvatarOption) => {
            const isSelected = selectedUrl === avatar.url;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedUrl(avatar.url)}
                className={`relative flex items-center justify-center rounded-xl border p-2.5 transition-all ${
                  isSelected
                    ? 'border-foreground bg-secondary ring-2 ring-foreground/40 scale-105'
                    : 'border-border/60 bg-background hover:bg-secondary/70 hover:border-border'
                }`}
              >
                <img src={avatar.url} alt="Avatar option" className="h-12 w-12 rounded-full" />
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40 font-mono">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
