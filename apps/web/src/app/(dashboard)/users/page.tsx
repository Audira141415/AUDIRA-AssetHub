"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, ChevronLeft, Search, UserCheck, UserX, Plus,
  Edit2, Trash2, X, ShieldCheck, AlertCircle, Clock
} from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/lib/store"

export default function UsersPage() {
  const user = useAuthStore((state) => state.user)
  const isSuperAdmin = user?.is_superuser || user?.role?.name === "Super Admin" || user?.role?.name === "Admin" || (user?.role as any) === "Super Admin" || (user?.role as any) === "Admin"

  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Operator", status: "Active" })

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin])

  const handleSave = async () => {
    if (!formData.name || !formData.email) return alert("Name and Email are required.");
    if (!isEditing && !formData.password) return alert("Password is required for new users.");
    
    try {
      if (isEditing && editingId) {
        // If password is empty during edit, don't send it to avoid hashing empty string
        const payload = { ...formData };
        if (!payload.password) delete (payload as any).password;
        await apiClient.put(`/users/${editingId}`, payload);
      } else {
        await apiClient.post('/users', formData);
      }
      setIsDrawerOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Save failed", err);
      alert(err.response?.data?.error || "Failed to save user.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", email: "", password: "", role: "Operator", status: "Active" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (usr: any) => {
    setFormData({ name: usr.name, email: usr.email, password: "", role: usr.role, status: usr.status });
    setIsEditing(true);
    setEditingId(usr.id);
    setIsDrawerOpen(true);
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to view or manage users.</p>
      </div>
    )
  }

  // Helpers
  const getRoleColor = (role: string) => {
    if (role === "Super Admin") return "text-blue-500 bg-blue-500/10"
    if (role === "Admin") return "text-purple-500 bg-purple-500/10"
    if (role === "Manager") return "text-sky-500 bg-sky-500/10"
    if (role === "Technician") return "text-green-500 bg-green-500/10"
    if (role === "Operator") return "text-amber-500 bg-amber-500/10"
    return "text-gray-500 bg-gray-500/10"
  }

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-green-500 bg-green-500/10"
    if (status === "Inactive") return "text-red-500 bg-red-500/10"
    return "text-gray-500 bg-gray-500/10"
  }

  const activeCount = users.filter(u => u.status === "Active").length;

  return (
    <div className="space-y-8 pb-12 mt-2 px-6">
      <HeroSection
        title="User Management"
        description="Manage application access, user roles, and security policies."
        imageSrc="/images/heroes/users.png"
      >
        <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light">
          <Plus className="w-5 h-5 mr-2" /> Add User
        </Button>
      </HeroSection>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-neu-inset text-accent">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Users</p>
              <p className="text-2xl font-display font-bold text-foreground">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-neu-inset text-green-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Users</p>
              <p className="text-2xl font-display font-bold text-foreground">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
          />
        </div>
      </div>

      <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Name</th>
                <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Role</th>
                <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Email</th>
                <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Status</th>
                <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A3B1C6]/10">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No users found.</td></tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300 hover:shadow-[inset_4px_0_0_0_#6C63FF]">
                    <td className="px-6 py-5">
                      <p className="font-bold text-foreground">{usr.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getRoleColor(usr.role)}`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-muted-foreground">{usr.email}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getStatusColor(usr.status)}`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => openEditDrawer(usr)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(usr.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit User' : 'Add User'}</h2>
                <p className="text-sm text-muted-foreground font-medium">Manage user account</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Password {isEditing && "(Leave blank to keep current)"}</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Operator">Operator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-2xl border border-accent/50 font-bold text-white bg-accent shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] hover:bg-accent-light" onClick={handleSave}>
                {isEditing ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
