export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  badge?: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    badge: '📊 Analyst',
  },
  {
    id: 'alex-dev',
    name: 'Alex Dev',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    badge: '⚡ Recruiter',
  },
  {
    id: 'felix-engineer',
    name: 'Software Engineer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'aneka-designer',
    name: 'UI/UX Designer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'brian-techlead',
    name: 'Tech Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'destiny-explorer',
    name: 'Cosmic Explorer',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 'bot-cyberfox',
    name: 'Cyber Fox Bot',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=256',
  },
];
