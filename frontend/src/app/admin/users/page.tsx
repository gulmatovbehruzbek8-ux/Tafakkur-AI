'use client';

import Sidebar from "@/app/components/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { getApiUrl } from "@/lib/api";

interface UserProfile {
  name?: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  teacherId?: string;
  faculty?: string;
  department?: string;
  course?: string;
  group?: string;
  gpa?: string;
  educationType?: string;
  position?: string;
  phone?: string;
  status?: string;
  email?: string;
}

interface UserItem {
  id: number;
  username: string;
  role: string;
  profile?: UserProfile;
}

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  studentId: string;
  teacherId: string;
  faculty: string;
  department: string;
  course: string;
  group: string;
  gpa: string;
  educationType: string;
  position: string;
  phone: string;
  status: string;
}

const DEFAULT_FORM: FormState = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'student',
  studentId: '',
  teacherId: '',
  faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
  department: "Dasturiy ta'minot injiniringi",
  course: '1-bosqich',
  group: 'AI-24',
  gpa: '4.5',
  educationType: 'Kunduzgi',
  position: "Katta o'qituvchi",
  phone: '+998 90 000 00 00',
  status: 'Faol',
};

const DEFAULT_USERS: UserItem[] = [
  {
    id: 1,
    username: "student",
    role: "student",
    profile: {
      name: "Bunyodbek Gulmatov",
      firstName: "Bunyodbek",
      lastName: "Gulmatov",
      email: "b.gulmatov@tafakkur.uz",
      studentId: "38291042",
      faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
      department: "Dasturiy ta'minot injiniringi",
      course: "3-bosqich",
      group: "AI-24",
      gpa: "4.8",
      educationType: "Kunduzgi",
      phone: "+998 90 123 45 67",
      status: "Faol",
    }
  },
  {
    id: 2,
    username: "teacher",
    role: "teacher",
    profile: {
      name: "Prof. Alisher Qodirov",
      firstName: "Alisher",
      lastName: "Qodirov",
      email: "a.qodirov@urdu.uz",
      teacherId: "PROF-1082",
      faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
      department: "Dasturiy ta'minot injiniringi",
      position: "Kafedra Mudiri",
      phone: "+998 93 765 43 21",
      status: "Faol",
    }
  },
  {
    id: 3,
    username: "admin",
    role: "admin",
    profile: {
      name: "Mirzobek Nurillayev",
      firstName: "Mirzobek",
      lastName: "Nurillayev",
      email: "admin@urdu.uz",
      faculty: "Rektorat",
      department: "Axborot Texnologiyalari Markazi",
      position: "Tizim Administratori",
      phone: "+998 97 111 22 33",
      status: "Faol",
    }
  },
  {
    id: 4,
    username: "dilnoza.k",
    role: "student",
    profile: {
      name: "Dilnoza Karimova",
      firstName: "Dilnoza",
      lastName: "Karimova",
      email: "d.karimova@tafakkur.uz",
      studentId: "38291089",
      faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
      department: "Dasturiy ta'minot injiniringi",
      course: "3-bosqich",
      group: "AI-24",
      gpa: "4.6",
      educationType: "Kunduzgi",
      phone: "+998 91 234 56 78",
      status: "Faol",
    }
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getCustomUsers = (): UserItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('tafakkur_custom_users') || '[]');
    } catch {
      return [];
    }
  };

  const fetchUsers = async () => {
    const customUsers = getCustomUsers();
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/users'));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge unique by username
          const merged = [...customUsers, ...data];
          const unique = Array.from(new Map(merged.map(u => [u.username, u])).values());
          setUsers(unique);
          return;
        }
      }
    } catch (err) {
      console.error("Foydalanuvchilarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }

    // Fallback to default + custom users
    const merged = [...customUsers, ...DEFAULT_USERS];
    const unique = Array.from(new Map(merged.map(u => [u.username, u])).values());
    setUsers(unique);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUserId(null);
    const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
    setForm({
      ...DEFAULT_FORM,
      role: 'student',
      studentId: randomId,
      teacherId: `PROF-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsModalOpen(true);
  };

  const openAddStudentModal = () => {
    setEditingUserId(null);
    const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
    setForm({
      ...DEFAULT_FORM,
      role: 'student',
      name: '',
      username: '',
      email: '',
      studentId: randomId,
      course: '1-bosqich',
      group: 'AI-24',
      gpa: '4.5',
      educationType: 'Kunduzgi',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUserId(user.id);
    const p = user.profile || {};
    setForm({
      name: p.name || (p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : user.username),
      username: user.username,
      email: p.email || `${user.username}@tafakkur.uz`,
      password: '',
      role: user.role,
      studentId: p.studentId || '',
      teacherId: p.teacherId || '',
      faculty: p.faculty || "Sun'iy Intellekt va Axborot Texnologiyalari",
      department: p.department || "Dasturiy ta'minot injiniringi",
      course: p.course || '1-bosqich',
      group: p.group || 'AI-24',
      gpa: p.gpa || '4.5',
      educationType: p.educationType || 'Kunduzgi',
      position: p.position || "Katta o'qituvchi",
      phone: p.phone || '+998 90 000 00 00',
      status: p.status || 'Faol',
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (!confirm(`Haqiqatan ham "${username}" foydalanuvchisini o'chirmoqchimisiz?`)) return;
    try {
      await fetch(getApiUrl(`/api/users/${id}`), { method: 'DELETE' });
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
    }
    setUsers(prev => prev.filter(u => u.id !== id && u.username !== username));
    if (typeof window !== 'undefined') {
      const custom = getCustomUsers().filter(u => u.id !== id && u.username !== username);
      localStorage.setItem('tafakkur_custom_users', JSON.stringify(custom));
    }
    showToast(`"${username}" muvaffaqiyatli o'chirildi.`);
  };

  const handleMakeAdmin = async (id: number) => {
    if (!confirm("Ushbu foydalanuvchiga tizim Administratori huquqini berishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'admin' } : u));
      }
    } catch (err) {
      console.error("Admin qilishda xatolik:", err);
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'admin' } : u));
    if (typeof window !== 'undefined') {
      const custom = getCustomUsers().map(u => u.id === id ? { ...u, role: 'admin' } : u);
      localStorage.setItem('tafakkur_custom_users', JSON.stringify(custom));
    }
    showToast("Foydalanuvchiga Administrator huquqi berildi.");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() && !form.username.trim()) {
      alert("Iltimos, kamida foydalanuvchi ismini kiriting.");
      return;
    }

    setIsSaving(true);

    const cleanLatin = form.name.trim().toLowerCase()
      .replace(/['`‘’ʻʼ]/g, '')
      .replace(/[^a-z0-9]/g, '.');

    const finalUsername = (
      form.username.trim() || 
      (form.email ? form.email.split('@')[0] : '') || 
      cleanLatin || 
      `user_${Date.now().toString().slice(-5)}`
    ).toLowerCase().replace(/\.+/g, '.').replace(/^\.|\.$/g, '');

    const finalEmail = form.email.trim() || `${finalUsername}@tafakkur.uz`;
    const finalPassword = form.password.trim() || 'tafakkur2026';
    
    const nameParts = form.name.trim().split(' ');
    const firstName = nameParts[0] || finalUsername;
    const lastName = nameParts.slice(1).join(' ') || '';

    const profileData: UserProfile = {
      name: form.name.trim() || finalUsername,
      firstName,
      lastName,
      email: finalEmail,
      phone: form.phone.trim() || '+998 90 000 00 00',
      status: form.status,
      faculty: form.faculty,
    };

    if (form.role === 'student' || form.role === 'oquvchi') {
      profileData.studentId = form.studentId.trim() || Math.floor(10000000 + Math.random() * 90000000).toString();
      profileData.course = form.course;
      profileData.group = form.group.trim();
      profileData.gpa = form.gpa.trim();
      profileData.educationType = form.educationType;
    } else if (form.role === 'teacher' || form.role === 'mentor') {
      profileData.teacherId = form.teacherId.trim() || `PROF-${Math.floor(1000 + Math.random() * 9000)}`;
      profileData.department = form.department.trim();
      profileData.position = form.position.trim();
    }

    const newUserItem: UserItem = {
      id: editingUserId || Date.now(),
      username: finalUsername,
      role: form.role,
      profile: profileData,
    };

    try {
      if (editingUserId) {
        const payload = {
          role: form.role,
          profile_data: profileData,
        };
        try {
          await fetch(getApiUrl(`/api/users/${editingUserId}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          // ignore network failure on vercel
        }
        setUsers(prev => prev.map(u => u.id === editingUserId ? newUserItem : u));
        if (typeof window !== 'undefined') {
          const custom = getCustomUsers().map(u => u.id === editingUserId ? newUserItem : u);
          localStorage.setItem('tafakkur_custom_users', JSON.stringify(custom));
        }
        showToast("Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi!");
        setIsModalOpen(false);
      } else {
        const payload = {
          username: finalUsername,
          password: finalPassword,
          role: form.role,
          profile_data: profileData,
        };
        try {
          await fetch(getApiUrl('/api/auth/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          // fallback to local registration
        }

        // Optimistic local update & persistence
        setUsers(prev => [newUserItem, ...prev.filter(u => u.username !== finalUsername)]);
        if (typeof window !== 'undefined') {
          const custom = getCustomUsers().filter(u => u.username !== finalUsername);
          localStorage.setItem('tafakkur_custom_users', JSON.stringify([newUserItem, ...custom]));
        }
        showToast(
          form.role === 'student' 
            ? `Yangi talaba muvaffaqiyatli saqlandi! Login: "${finalUsername}", Parol: "${finalPassword}"`
            : `Yangi foydalanuvchi muvaffaqiyatli yaratildi! Login: "${finalUsername}"`
        );
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
      setUsers(prev => [newUserItem, ...prev.filter(u => u.username !== finalUsername)]);
      if (typeof window !== 'undefined') {
        const custom = getCustomUsers().filter(u => u.username !== finalUsername);
        localStorage.setItem('tafakkur_custom_users', JSON.stringify([newUserItem, ...custom]));
      }
      showToast("Foydalanuvchi muvaffaqiyatli saqlandi!");
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = 
        filterRole === 'all' ? true :
        filterRole === 'student' ? (user.role === 'student' || user.role === 'oquvchi') :
        filterRole === 'teacher' ? (user.role === 'teacher' || user.role === 'mentor') :
        user.role === 'admin';

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesRole;

      const name = (user.profile?.name || user.username || '').toLowerCase();
      const email = (user.profile?.email || `${user.username}@tafakkur.uz`).toLowerCase();
      const idStr = (user.profile?.studentId || user.profile?.teacherId || '').toLowerCase();
      const group = (user.profile?.group || '').toLowerCase();

      return matchesRole && (name.includes(q) || email.includes(q) || idStr.includes(q) || group.includes(q));
    });
  }, [users, filterRole, searchQuery]);

  const stats = useMemo(() => {
    const total = users.length;
    const students = users.filter(u => u.role === 'student' || u.role === 'oquvchi').length;
    const teachers = users.filter(u => u.role === 'teacher' || u.role === 'mentor').length;
    const admins = users.filter(u => u.role === 'admin').length;
    return { total, students, teachers, admins };
  }, [users]);

  return (
    <div className="tf-page">
      <Sidebar role="admin" activeRoute="/admin/users" />
      
      <main className="tf-main">
        <div className="tf-container-wide space-y-6">
          
          {/* Success Toast */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
              <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-xs sm:text-sm font-bold">
                {toastMessage}
              </div>
            </div>
          )}

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Boshqaruv Paneli</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">Foydalanuvchilar va Profillar</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Talabalar, mentorlar va tizim ma'murlarining to'liq ma'lumotlarini boshqarish
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={openAddStudentModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>+ O'quvchi (Talaba) Qo'shish</span>
              </button>

              <button 
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Boshqa Foydalanuvchi</span>
              </button>
            </div>
          </header>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="tf-metric">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami Foydalanuvchilar</p>
              <p className="font-display text-2xl md:text-3xl font-bold text-ink mt-2 font-mono">{stats.total}</p>
            </div>
            <div className="tf-metric">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Talabalar</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2 font-mono">{stats.students}</p>
            </div>
            <div className="tf-metric">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">O'qituvchilar</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-2 font-mono">{stats.teachers}</p>
            </div>
            <div className="tf-metric">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Administratorlar</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-700 mt-2 font-mono">{stats.admins}</p>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="tf-card-solid p-4 flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto">
              {[
                { key: 'all', label: 'Barchasi' },
                { key: 'student', label: 'Talabalar' },
                { key: 'teacher', label: "O'qituvchilar" },
                { key: 'admin', label: 'Adminlar' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterRole(tab.key as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterRole === tab.key 
                      ? 'bg-white text-blue-700 shadow-2xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="F.I.SH., email, ID yoki guruh..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white text-slate-900 transition-all font-sans"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Users Table */}
          <div className="tf-card-solid overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">Foydalanuvchilar yuklanmoqda...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">Hech qanday foydalanuvchi topilmadi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Foydalanuvchi</th>
                      <th className="p-4">HEMIS ID</th>
                      <th className="p-4">Roli va Yo'nalishi</th>
                      <th className="p-4">Aloqa</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4 pr-6 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map(u => {
                      const p = u.profile || {};
                      const fullName = p.name || (p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : u.username);
                      const isStudent = u.role === 'student' || u.role === 'oquvchi';
                      const isTeacher = u.role === 'teacher' || u.role === 'mentor';
                      const idTag = isStudent ? (p.studentId || 'ID yo\'q') : isTeacher ? (p.teacherId || 'ID yo\'q') : 'ADMIN';

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{fullName}</div>
                                <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                              {idTag}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                u.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                isTeacher ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {u.role === 'admin' ? 'Admin' : isTeacher ? "O'qituvchi" : 'Talaba'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {isStudent && (
                                <span>{p.group ? `${p.group} guruhi` : ''} {p.course ? `• ${p.course}` : ''}</span>
                              )}
                              {isTeacher && (
                                <span>{p.position || p.department || 'Professor'}</span>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="text-xs text-slate-800 font-medium">{p.email || `${u.username}@tafakkur.uz`}</div>
                            <div className="text-xs text-slate-400">{p.phone || '+998 -- --- -- --'}</div>
                          </td>

                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              p.status === 'Akademik ta\'til' || p.status === 'Ta\'tilda' 
                                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                p.status === 'Akademik ta\'til' || p.status === 'Ta\'tilda' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                              {p.status || 'Faol'}
                            </span>
                          </td>

                          <td className="p-4 pr-6 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEditModal(u)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors"
                              >
                                Tahrirlash
                              </button>

                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleMakeAdmin(u.id)}
                                  title="Admin huquqini berish"
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                                >
                                  +Admin
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                title="O'chirish"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modern Profile Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 md:p-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  {editingUserId ? "Foydalanuvchi ma'lumotlari" : "Yangi a'zo ro'yxatga olish"}
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-ink tracking-tight mt-0.5">
                  {editingUserId ? `${form.name || form.username} Profilini O'zgartirish` : "HEMIS Profil Ma'lumotlarini Kiritish"}
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center text-lg font-bold transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Role Selector Header */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Tizimdagi Roli *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'student', title: 'Talaba (HEMIS)', desc: 'Bakalavr/Magistr' },
                    { id: 'teacher', title: "O'qituvchi / Mentor", desc: 'Professor/Pedagog' },
                    { id: 'admin', title: "Ma'muriyat", desc: 'Rektorat / Boshqaruv' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        form.role === r.id
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className={`text-xs font-bold ${form.role === r.id ? 'text-blue-700' : 'text-slate-800'}`}>
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 1: Authentication & Contact */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  1. Hisob va Shaxsiy Ma'lumotlar
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      F.I.SH. (To&apos;liq Ism va Familiya) *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={form.name}
                      onChange={e => {
                        const val = e.target.value;
                        const autoUser = val.toLowerCase().trim()
                          .replace(/['`‘’ʻʼ]/g, '')
                          .replace(/[^a-z0-9]/g, '.');
                        setForm(prev => ({
                          ...prev,
                          name: val,
                          username: prev.username && prev.username !== autoUser ? prev.username : autoUser,
                          email: prev.email && prev.email !== `${autoUser}@tafakkur.uz` ? prev.email : (autoUser ? `${autoUser}@tafakkur.uz` : '')
                        }));
                      }}
                      placeholder="Masalan: Behruzbek Gulmatov"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Tizimdagi Login (Username)
                    </label>
                    <input 
                      type="text" 
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      placeholder="Masalan: b.gulmatov (avtomatik generatsiya)"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Elektron Pochta
                    </label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="talaba@tafakkur.uz"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Telefon Raqami
                    </label>
                    <input 
                      type="text" 
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                    />
                  </div>

                  {!editingUserId && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Tizimga Kirish Paroli
                      </label>
                      <input 
                        type="password" 
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="Standart parol: tafakkur2026 (bo'sh qoldirilsa avtomatik qo'yiladi)"
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Role-Specific Details Shown on Profile Page */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Profil Sahifasida Ko'rsatiladigan HEMIS Ma'lumotlari
                </h3>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Holati (Status)
                  </label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                  >
                    <option value="Faol">Faol</option>
                    <option value="Akademik ta'til">Akademik ta'til</option>
                    <option value="Ta'tilda">Ta'tilda</option>
                    <option value="Chetlashtirilgan">Chetlashtirilgan</option>
                  </select>
                </div>

                {/* STUDENT SPECIFIC FIELDS */}
                {(form.role === 'student' || form.role === 'oquvchi') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/40 p-5 rounded-2xl border border-blue-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        Talaba HEMIS ID Raqami *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.studentId}
                        onChange={e => setForm({ ...form, studentId: e.target.value })}
                        placeholder="38491023"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        Fakultet *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.faculty}
                        onChange={e => setForm({ ...form, faculty: e.target.value })}
                        placeholder="Sun'iy Intellekt va Axborot Texnologiyalari"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        Akademik Guruh *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.group}
                        onChange={e => setForm({ ...form, group: e.target.value })}
                        placeholder="AI-22"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        Ta'lim Bosqichi (Kurs) *
                      </label>
                      <select 
                        value={form.course}
                        onChange={e => setForm({ ...form, course: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      >
                        <option value="1-bosqich">1-bosqich</option>
                        <option value="2-bosqich">2-bosqich</option>
                        <option value="3-bosqich">3-bosqich</option>
                        <option value="4-bosqich">4-bosqich</option>
                        <option value="Magistratura 1-kurs">Magistratura 1-kurs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        GPA Ko'rsatkichi (0.0 - 5.0)
                      </label>
                      <input 
                        type="text" 
                        value={form.gpa}
                        onChange={e => setForm({ ...form, gpa: e.target.value })}
                        placeholder="4.8"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1.5">
                        Ta'lim Shakli
                      </label>
                      <select 
                        value={form.educationType}
                        onChange={e => setForm({ ...form, educationType: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      >
                        <option value="Kunduzgi">Kunduzgi</option>
                        <option value="Kechki">Kechki</option>
                        <option value="Masofaviy">Masofaviy</option>
                        <option value="Sirtqi">Sirtqi</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* TEACHER SPECIFIC FIELDS */}
                {(form.role === 'teacher' || form.role === 'mentor') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-1.5">
                        O'qituvchi HEMIS ID *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.teacherId}
                        onChange={e => setForm({ ...form, teacherId: e.target.value })}
                        placeholder="PROF-9012"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-mono focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-1.5">
                        Fakultet *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.faculty}
                        onChange={e => setForm({ ...form, faculty: e.target.value })}
                        placeholder="Sun'iy Intellekt va Axborot Texnologiyalari"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-1.5">
                        Kafedra *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={form.department}
                        onChange={e => setForm({ ...form, department: e.target.value })}
                        placeholder="Dasturiy ta'minot injiniringi"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-950 uppercase tracking-wider mb-1.5">
                        Lavozimi (Akademik Unvoni) *
                      </label>
                      <select 
                        value={form.position}
                        onChange={e => setForm({ ...form, position: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:border-blue-600 outline-none text-slate-900"
                      >
                        <option value="Katta o'qituvchi">Katta o'qituvchi</option>
                        <option value="Dotsent">Dotsent</option>
                        <option value="Professor">Professor</option>
                        <option value="Assistent">Assistent</option>
                        <option value="Kafedra mudiri">Kafedra mudiri</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ADMIN SPECIFIC */}
                {form.role === 'admin' && (
                  <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-700">
                    Administrator sifatida to'liq tizim ruxsatlari, foydalanuvchilar qo'shish va rektorat boshqaruv paneli beriladi.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
                >
                  Bekor Qilish
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-50 transition-all shadow-sm shadow-xs"
                >
                  {isSaving ? "Saqlanmoqda..." : editingUserId ? "O'zgarishlarni Saqlash" : "Foydalanuvchini Yaratish"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
