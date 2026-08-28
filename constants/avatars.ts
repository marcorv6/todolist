export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  badge?: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'data-analyst-princess',
    name: 'Data Analyst',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JasmineAnalyst&hair=long01&hairColor=000000&skinColor=f8d25c',
    badge: '👑 Black-Haired Princess',
  },
  {
    id: 'alex-dev',
    name: 'Alex Dev',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AlexDev',
    badge: '⚡ Recruiter',
  },
  {
    id: 'fullstack-engineer',
    name: 'Full-Stack Developer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FelixCoder',
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AnekaArtist',
  },
  {
    id: 'tech-lead',
    name: 'Systems Architect',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BrianArchitect',
  },
  {
    id: 'ai-engineer',
    name: 'AI Systems Engineer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MayaAI',
  },
];
