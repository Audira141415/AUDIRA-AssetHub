"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronRight, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  List, 
  LayoutGrid,
  MoreVertical,
  Eye,
  Edit2,
  X,
  ShieldCheck,
  Shield,
  UserCheck,
  UserX,
  UserPlus,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  Briefcase,
  ArrowRightLeft,
  Box,
  ChevronLeft
} from "lucide-react"

import { mockUsers } from "@/lib/mock-data"

// Types
type UserType = typeof mockUsers[0]

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<string | null>("USR-0001")
  
  // Feature States
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [roleFilter, setRoleFilter] = useState("All Roles")
  const [locationFilter, setLocationFilter] = useState("All Locations")
  
  const [activeTab, setActiveTab] = useState("Overview")

  // Derived Data (Filtering)
  const filteredUsers = useMemo(() => {
    let result = [...users]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "All Status") result = result.filter(u => u.status === statusFilter)
    if (roleFilter !== "All Roles") result = result.filter(u => u.role === roleFilter)
    if (locationFilter !== "All Locations") result = result.filter(u => u.location === locationFilter)

    return result
  }, [users, searchQuery, statusFilter, roleFilter, locationFilter])

  // Helpers
  const getRoleColor = (role: string) => {
    if (role === "Super Admin") return "text-blue-500 bg-background shadow-neu-inset-small"
    if (role === "Admin") return "text-purple-500 bg-background shadow-neu-inset-small"
    if (role === "Manager") return "text-sky-500 bg-background shadow-neu-inset-small"
    if (role === "Technician") return "text-green-500 bg-background shadow-neu-inset-small"
    if (role === "Operator") return "text-amber-500 bg-background shadow-neu-inset-small"
    if (role === "Viewer") return "text-gray-500 bg-background shadow-neu-inset-small"
    return "text-gray-500 bg-background shadow-neu-inset-small"
  }

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-green-500 shadow-neu-inset-small bg-background"
    if (status === "Inactive") return "text-red-500 shadow-neu-inset-small bg-background"
    return "text-gray-500 shadow-neu-inset-small bg-background"
  }

  const activeUserData = users.find(u => u.id === selectedUser)

  // Dynamic Options for Selects
  const uniqueStatuses = ["All Status", ...Array.from(new Set(users.map(u => u.status)))]
  const uniqueRoles = ["All Roles", ...Array.from(new Set(users.map(u => u.role)))]
  const uniqueLocations = ["All Locations", ...Array.from(new Set(users.map(u => u.location)))]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedUser ? 'pr-0' : ''}`}>
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 font-medium">
              <MapPin size={12} className="mr-1" />
              <span>Management</span>
              <ChevronRight size={12} className="mx-1" />
              <span className="text-foreground font-bold">Users</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Users</h1>
            <p className="text-sm text-muted-foreground font-medium">Manage system users, roles and permissions</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Upload size={18} />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold border-none whitespace-nowrap">
              <Plus size={18} />
              Add User
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ShieldCheck className="text-blue-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Users</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">48</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">All system users</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <UserCheck className="text-green-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Active Users</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">41</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">85% of total</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Shield className="text-purple-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Admins</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">6</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">System administrators</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <UserX className="text-amber-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Inactive Users</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">7</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Users not active</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <UserPlus className="text-cyan-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">New This Month</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">5</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Joined this month</p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 h-12 rounded-2xl text-sm font-medium focus-visible:ring-0 focus-visible:border-accent"
            />
            {searchQuery && (
              <X 
                size={16} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All Status")
              setRoleFilter("All Roles")
              setLocationFilter("All Locations")
            }}
            className="bg-background shadow-neu-extruded text-foreground hover:text-accent rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold hover:shadow-neu-hover active:shadow-neu-inset-small whitespace-nowrap"
          >
            <Filter size={18} className="text-accent" />
            Filter
          </Button>
          
          <div className="flex bg-background shadow-neu-inset-small rounded-2xl p-1 h-12 items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 rounded-xl shrink-0 transition-all ${viewMode === 'list' ? 'shadow-neu-extruded bg-background text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 rounded-xl shrink-0 transition-all ${viewMode === 'grid' ? 'shadow-neu-extruded bg-background text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {viewMode === "list" ? (
            /* Table View */
            <div className="flex flex-col gap-4 mb-2">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left min-w-[1000px]">
                    <thead className="text-xs text-muted-foreground uppercase bg-background shadow-neu-inset-small sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">User</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Role</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Email</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Location</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Status</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Last Login</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap text-right tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user.id} 
                          className={`border-b border-[#A3B1C6]/20 cursor-pointer transition-all duration-300 ${selectedUser === user.id ? 'shadow-neu-inset-small bg-background text-accent' : 'hover:shadow-neu-inset-small'}`}
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <td className="px-5 py-4 flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-background shadow-neu-extruded object-cover" />
                            <div className="min-w-0">
                              <p className={`font-bold text-sm whitespace-nowrap truncate ${selectedUser === user.id ? 'text-accent' : 'text-foreground'}`}>{user.name}</p>
                              <p className="text-[11px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap truncate">{user.username}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-medium">{user.email}</td>
                          <td className="px-5 py-4 whitespace-nowrap font-medium text-foreground">{user.location}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-medium">{user.lastLogin}</td>
                          <td className="px-5 py-4 text-right whitespace-nowrap relative">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Eye size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Edit2 size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <MoreVertical size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-background shadow-neu-extruded rounded-[24px] p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground font-medium shrink-0">
                <div>Showing 1 to {filteredUsers.length} of 48 users</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground opacity-50 cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded bg-accent text-white hover:bg-accent/90 hover:text-white font-bold">
                      1
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground hover:text-foreground">
                      2
                    </Button>
                    <span className="px-2">...</span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground hover:text-foreground">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-neu-extruded cursor-pointer hover:shadow-neu-hover">
                    <span className="font-bold text-foreground">10 / page</span>
                    <ChevronRight size={14} className="rotate-90 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Grid View (stub) */
            <div className="flex-1 overflow-y-auto mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                <p className="text-muted-foreground">Grid view is under construction.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedUser && activeUserData && (
        <div className="w-[360px] bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col h-full overflow-hidden shrink-0 transition-all mb-2 animate-in slide-in-from-right-8 duration-300">
          
          <div className="relative p-6 pt-10 pb-4 bg-background shadow-neu-inset-deep flex flex-col items-center shrink-0 border-b border-[#A3B1C6]/20">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-extruded bg-background ${activeUserData.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                {activeUserData.status}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full shadow-neu-extruded bg-background text-foreground hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small" onClick={() => setSelectedUser(null)}>
                <X size={14} />
              </Button>
            </div>
            
            <img src={activeUserData.avatar} alt={activeUserData.name} className="w-20 h-20 rounded-full border-4 border-background shadow-neu-extruded object-cover mb-4" />
            <h2 className="text-lg font-black text-foreground mb-1 text-center">{activeUserData.name}</h2>
            <p className="text-xs text-accent font-bold text-center mb-1">{activeUserData.roleLabel}</p>
            <p className="text-[10px] text-muted-foreground text-center font-medium">{activeUserData.email}</p>
          </div>

          <div className="flex border-b border-[#A3B1C6]/20 px-2 pt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
            {['Overview', 'Permissions', 'Locations', 'Activity', 'Settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 relative space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activeTab === 'Overview' && (
              <div className="space-y-6 animate-in fade-in duration-300 pb-4">
                
                {/* Properties */}
                <div className="grid grid-cols-[130px_1fr] gap-y-4 text-xs">
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><UserCheck size={14} /> User ID</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.id}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Briefcase size={14} /> Username</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.username}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><ShieldCheck size={14} /> Role</div>
                  <div><span className={`px-2 py-0.5 text-[9px] rounded-lg ${getRoleColor(activeUserData.role)} font-bold`}>{activeUserData.role}</span></div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} /> Status</div>
                  <div><span className={`px-2 py-0.5 text-[9px] rounded-lg ${getStatusColor(activeUserData.status)} font-bold`}>{activeUserData.status}</span></div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Calendar size={14} /> Joined Date</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.joinedDate}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Clock size={14} /> Last Login</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.lastLogin}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2 mt-2 pt-2 border-t border-[#A3B1C6]/20"><AlertCircle size={14} className="opacity-0" /> Email</div>
                  <div className="text-accent font-bold truncate mt-2 pt-2 border-t border-[#A3B1C6]/20">{activeUserData.email}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} className="opacity-0" /> Phone</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.phone}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><MapPin size={14} /> Primary Location</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.location}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} className="opacity-0" /> Language</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.language}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Clock size={14} /> Time Zone</div>
                  <div className="text-foreground font-bold truncate">{activeUserData.timezone}</div>
                </div>

                {/* Activity Summary */}
                <div className="bg-background shadow-neu-extruded rounded-[20px] p-4 border-neu">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-sm tracking-tight">Activity Summary</h3>
                    <button className="text-[10px] font-bold text-accent hover:underline">View all activity</button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <UserCheck size={14} /> Logins (This Month)
                      </div>
                      <div className="font-bold text-foreground">{activeUserData.activity.logins}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <Box size={14} /> Assets Created
                      </div>
                      <div className="font-bold text-foreground">{activeUserData.activity.assetsCreated}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <ArrowRightLeft size={14} /> Asset Movements
                      </div>
                      <div className="font-bold text-foreground">{activeUserData.activity.assetMovements}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <ShieldCheck size={14} /> Warranties Managed
                      </div>
                      <div className="font-bold text-foreground">{activeUserData.activity.warrantiesManaged}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground font-bold">
                        <AlertCircle size={14} /> Reports Generated
                      </div>
                      <div className="font-bold text-foreground">{activeUserData.activity.reportsGenerated}</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab !== 'Overview' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-inset-deep flex items-center justify-center mb-4">
                  <Shield size={24} className="text-muted-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Manage {activeTab}</h4>
                <p className="text-xs text-muted-foreground mb-6">View and manage all {activeTab.toLowerCase()} associated with {activeUserData.name}.</p>
                <Button className="w-full bg-background shadow-neu-extruded text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold transition-all">
                  Open {activeTab} Settings
                </Button>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#A3B1C6]/20 shrink-0">
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold text-sm transition-all border-none gap-2">
              <Edit2 size={16} />
              Edit User
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
