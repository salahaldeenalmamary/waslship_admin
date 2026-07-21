import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Mail, 
  Shield, 
  Trash2, 
  UserCheck, 
  UserX,
  Search,
  RefreshCw,
  AlertCircle,
  X,
  Pencil,
  Phone,
  Lock,
  Loader2
} from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';
import { User, UserRole, UserStatus } from '../../../types';

const UserSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-slate-200 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-slate-100 rounded w-32"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-slate-100 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 bg-slate-100 rounded w-12"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="h-8 bg-slate-100 rounded w-8 ml-auto"></div>
    </td>
  </tr>
);

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { data: users = [], isLoading, isFetching, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status?: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
      case UserStatus.INACTIVE: return 'bg-slate-100 text-slate-700';
      case UserStatus.SUSPENDED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleToggleStatus = (user: User) => {
    const isCurrentlyActive = user.isActive ?? (user.status === UserStatus.ACTIVE);
    const newStatus = isCurrentlyActive ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    updateUser.mutate({ id: user.id, payload: { status: newStatus } });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setPassword(''); // never pre-populate password
    setPhoneNumber(user.phoneNumber || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) return setFormError('Full Name is required.');
    if (!phoneNumber.trim()) return setFormError('Phone Number is required.');

    if (editingUser) {
      // Edit mode
      updateUser.mutate(
        {
          id: editingUser.id,
          payload: {
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim()
          }
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            setFormError(err.message || 'Failed to update administrator.');
          }
        }
      );
    } else {
      // Create mode
      if (!email.trim()) return setFormError('Email Address is required.');
      if (!password) return setFormError('Password is required.');
      if (password.length < 6) return setFormError('Password must be at least 6 characters.');

      createUser.mutate(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
          phoneNumber: phoneNumber.trim(),
          role: 'Admin'
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            setFormError(err.message || 'Failed to create administrator.');
          }
        }
      );
    }
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage admin access and operator permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm">{(error as Error).message}</p>
          </div>
          <button onClick={() => refetch()} className="text-xs font-semibold underline hover:text-rose-800">
            Retry
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <>
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">Try adjusting your search or add a new user.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.isActive ?? (user.status === UserStatus.ACTIVE);
                  const currentStatus = isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
                            <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </span>
                              {user.phoneNumber && (
                                <span className="flex items-center text-slate-400">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {user.phoneNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-slate-600 capitalize">
                          <Shield className="w-4 h-4 mr-2 text-indigo-500" />
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title={isActive ? 'Deactivate' : 'Activate'}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this user?')) {
                                deleteUser.mutate(user.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elegant Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Edit Administrator' : 'Add New Administrator'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email"
                    required
                    disabled={!!editingUser}
                    placeholder="name@waslship.com"
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="tel"
                    required
                    placeholder="e.g. 0501234567"
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center min-w-[80px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingUser ? (
                    'Save Changes'
                  ) : (
                    'Add Admin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
