'use client';

import React, { useState } from 'react';
import { PenTool, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface JournalInputProps {
  onSubmit: (text: string, tags: string[]) => void;
  disabled?: boolean;
}

export function JournalInput({ onSubmit, disabled = false }: JournalInputProps) {
  const [text, setText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text, tags);
    setText('');
    setTags([]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <PenTool className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-lg font-bold">Mental Sandbox</CardTitle>
        </div>
        <CardDescription>
          Pour out your thoughts. What’s on your mind? Writing helps declutter your consciousness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Area */}
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I noticed I feel slightly anxious today because..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          disabled={disabled}
        />

        {/* Tags Section */}
        <div className="space-y-2">
          <label htmlFor="tag-input" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Contextual Tags
          </label>
          <div className="flex flex-wrap gap-2 items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-2 min-h-12">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            <form onSubmit={handleAddTag} className="flex-1 min-w-[120px] flex">
              <input
                id="tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags (work, sleep...)"
                className="w-full bg-transparent border-0 outline-none p-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-0 focus:outline-none"
                disabled={disabled}
              />
              {tagInput && (
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="text-slate-400 hover:text-emerald-500 p-1"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-900 pt-4">
        <span className="text-xs text-slate-400">
          {text.length} characters
        </span>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="rounded-xl px-5"
        >
          Submit Log
        </Button>
      </CardFooter>
    </Card>
  );
}
