export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  badge?: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'princess-black-hair',
    name: 'Black-Haired Princess',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine&hairColor=2c1b18&top=longHair&skinColor=f8d25c',
    badge: '👑 Princess',
  },
  {
    id: 'alex-dev',
    name: 'Alex Dev',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    badge: '⚡ Recruiter',
  },
  {
    id: 'felix-engineer',
    name: 'Software Engineer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },
  {
    id: 'aneka-designer',
    name: 'UI/UX Designer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  },
  {
    id: 'brian-techlead',
    name: 'Tech Lead',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
  },
  {
    id: 'destiny-explorer',
    name: 'Cosmic Explorer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Destiny',
  },
  {
    id: 'bot-cyberfox',
    name: 'Cyber Fox Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Fox',
  },
];
