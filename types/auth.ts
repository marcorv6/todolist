export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  loginAsDemoGuest: () => Promise<User>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void;
}
