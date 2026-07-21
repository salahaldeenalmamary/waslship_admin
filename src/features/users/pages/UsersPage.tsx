import React, { useState } from 'react';
import { 
  Mail, 
  Shield, 
  Trash2, 
  UserCheck, 
  UserX,
  Search,
  AlertCircle,
  Pencil,
  Phone
} from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';
import { User, UserStatus } from '../../../types';
import { DataTable, Column } from '../../../components/common/DataTable';
import { UserHeader } from '../components/UserHeader';
import { UserModal } from '../components/UserModal';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, isFetching, error, refetch } = useUsers(page, pageSize);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const admins = data?.items || [];
  const totalCount = data?.totalCount || 0;

  const filteredUsers = admins.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[sortBy as keyof User];
    let valB = b[sortBy as keyof User];

    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return 0;
  });

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
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    password?: string;
  }) => {
    return new Promise<void>((resolve, reject) => {
      if (editingUser) {
        updateUser.mutate(
          {
            id: editingUser.id,
            payload: {
              fullName: payload.fullName,
              phoneNumber: payload.phoneNumber
            }
          },
          {
            onSuccess: () => {
              setIsModalOpen(false);
              resolve();
            },
            onError: (err: any) => {
              reject(err);
            }
          }
        );
      } else {
        createUser.mutate(
          {
            fullName: payload.fullName,
            email: payload.email!,
            password: payload.password!,
            phoneNumber: payload.phoneNumber,
            role: 'Admin'
          },
          {
            onSuccess: () => {
              setIsModalOpen(false);
              resolve();
            },
            onError: (err: any) => {
              reject(err);
            }
          }
        );
      }
    });
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  const columns: Column<User>[] = [
    {
      id: 'fullName',
      header: 'User',
      sortable: true,
      accessor: (user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {user.fullName.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
            <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {user.email}
              </span>
              {user.phoneNumber && (
                <span className="flex items-center text-slate-400">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {user.phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      accessor: (user) => (
        <div className="flex items-center text-sm text-slate-600 capitalize">
          <Shield className="w-4 h-4 mr-2 text-indigo-500" />
          {user.role}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      accessor: (user) => {
        const isActive = user.isActive ?? (user.status === UserStatus.ACTIVE);
        const currentStatus = isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      className: 'text-right',
      accessor: (user) => {
        const isActive = user.isActive ?? (user.status === UserStatus.ACTIVE);
        return (
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={() => openEditModal(user)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Edit User"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => handleToggleStatus(user)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title={isActive ? 'Deactivate' : 'Activate'}
            >
              {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </button>
            <button 
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this user?')) {
                  deleteUser.mutate(user.id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <UserHeader 
        onAddClick={openCreateModal}
        onRefreshClick={() => refetch()}
        isFetching={isFetching}
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm">{(error as Error).message}</p>
          </div>
          <button onClick={() => refetch()} className="text-xs font-semibold underline hover:text-rose-800 cursor-pointer">
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

        <DataTable
          columns={columns}
          data={sortedUsers}
          isLoading={isLoading}
          sorting={{
            sortBy,
            sortOrder,
            onSort: (key, order) => {
              setSortBy(key);
              setSortOrder(order);
            }
          }}
          pagination={{
            page,
            pageSize,
            totalCount,
            onPageChange: (newPage) => setPage(newPage),
            onPageSizeChange: (newPageSize) => {
              setPageSize(newPageSize);
              setPage(1);
            }
          }}
        />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingUser={editingUser}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
