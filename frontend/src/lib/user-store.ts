export interface AppUser {
  id: string | number;
  username: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  department?: string;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: string;
  password?: string;
}

export const INITIAL_USERS: AppUser[] = [
  {
    id: "usr-1",
    username: "admin",
    fullName: "Bosh Administrator",
    email: "admin@tafakkur.edu.uz",
    role: "admin",
    department: "Rektorat / IT Boshqarmasi",
    status: "active",
    lastActive: "Hozir onlayn",
    password: "admin123"
  },
  {
    id: "usr-2",
    username: "teacher",
    fullName: "Prof. O. Turdiyev",
    email: "turdiyev@tafakkur.edu.uz",
    role: "teacher",
    department: "Dasturiy Injiniring Kafedrasi",
    status: "active",
    lastActive: "10 daqiqa oldin",
    password: "teacher123"
  },
  {
    id: "usr-3",
    username: "student",
    fullName: "Behruzbek Gulmatov",
    email: "student@tafakkur.edu.uz",
    role: "student",
    department: "CS-22-01 Guruhi",
    status: "active",
    lastActive: "Bugun, 09:40",
    password: "student123"
  },
  {
    id: "usr-4",
    username: "dilnoza_karimova",
    fullName: "Dilnoza Karimova",
    email: "d.karimova@tafakkur.edu.uz",
    role: "student",
    department: "CS-22-01 Guruhi",
    status: "active",
    lastActive: "Kecha, 18:20",
    password: "password123"
  },
  {
    id: "usr-5",
    username: "jasur_rahimov",
    fullName: "Jasur Rahimov",
    email: "j.rahimov@tafakkur.edu.uz",
    role: "student",
    department: "CS-22-02 Guruhi",
    status: "active",
    lastActive: "3 kun oldin",
    password: "password123"
  }
];

declare global {
  // eslint-disable-next-line no-var
  var __TAFAKKUR_USERS__: AppUser[] | undefined;
}

export function getStoredUsers(): AppUser[] {
  if (!global.__TAFAKKUR_USERS__) {
    global.__TAFAKKUR_USERS__ = [...INITIAL_USERS];
  }
  return global.__TAFAKKUR_USERS__;
}

export function addStoredUser(user: Partial<AppUser>): AppUser {
  const users = getStoredUsers();
  const newUser: AppUser = {
    id: user.id || `usr-${Date.now()}`,
    username: user.username?.trim().toLowerCase() || `user_${Date.now()}`,
    fullName: user.fullName || "Yangi Foydalanuvchi",
    email: user.email || `${user.username || 'user'}@tafakkur.edu.uz`,
    role: user.role || 'student',
    department: user.department || (user.role === 'student' ? 'CS-22 Guruhi' : 'Axborot Texnologiyalari'),
    status: user.status || 'active',
    lastActive: 'Hozirgina qo\'shildi',
    password: user.password || 'tafakkur2026'
  };

  const existingIdx = users.findIndex(u => u.username.toLowerCase() === newUser.username.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...newUser };
    return users[existingIdx];
  }

  users.push(newUser);
  return newUser;
}

export function updateStoredUser(id: string | number, updates: Partial<AppUser>): AppUser | null {
  const users = getStoredUsers();
  const idx = users.findIndex(u => String(u.id) === String(id) || u.username === String(id));
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    return users[idx];
  }
  return null;
}

export function deleteStoredUser(id: string | number): boolean {
  const users = getStoredUsers();
  const initialLen = users.length;
  global.__TAFAKKUR_USERS__ = users.filter(u => String(u.id) !== String(id) && u.username !== String(id));
  return global.__TAFAKKUR_USERS__.length < initialLen;
}
