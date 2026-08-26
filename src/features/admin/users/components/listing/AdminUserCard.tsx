import React from "react";
import { Shield, ShieldAlert, Mail, Phone, MoreVertical } from "lucide-react";
import { AdminUser } from "@/features/admin/users/types/admin.types";

interface AdminUserCardProps {
  user: AdminUser;
  onEdit?: (user: AdminUser) => void;
  onToggleBlock?: (user: AdminUser) => void;
  onToggleVerify?: (user: AdminUser) => void;
}

export function AdminUserCard({ user, onEdit, onToggleBlock, onToggleVerify }: AdminUserCardProps) {
  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isSuperAdmin ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {isSuperAdmin ? <ShieldAlert size={20} /> : <Shield size={20} />}
          </div>
          <div>
            <h3 className="text-font-subtitle font-bold text-gray-900">{user.name}</h3>
            <span className={`inline-block px-2 py-0.5 mt-1 text-xs font-semibold rounded-md ${isSuperAdmin ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
              {user.role}
            </span>
          </div>
        </div>
        <button 
          onClick={() => onEdit?.(user)}
          className="p-1 text-gray-400 hover:text-[--mama-hot-pink] transition-colors rounded-full hover:bg-gray-50"
          aria-label="Opsi lainnya"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Phone size={14} />
          <span>{user.phone || "Tidak ada nomor"}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        {/* Block Status Toggle */}
        <button
          onClick={() => onToggleBlock?.(user)}
          className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 -ml-2 rounded transition-colors group"
          title={user.isBlocked ? "Buka Blokir" : "Blokir Pengguna"}
        >
          <span className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 border-b border-dashed border-gray-300">
            {user.isBlocked ? 'Diblokir' : 'Aktif'}
          </span>
        </button>

        {/* Verification Toggle */}
        <button
          onClick={() => onToggleVerify?.(user)}
          className={`text-xs font-medium px-2 py-1 rounded transition-colors border border-dashed ${
            user.isVerified 
              ? 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100' 
              : 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
          }`}
          title={user.isVerified ? "Batalkan Verifikasi" : "Verifikasi Pengguna"}
        >
          {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
        </button>
      </div>
    </div>
  );
}

export function AdminUserSkeleton() {
  return (
    <div className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-2">
        <div className="h-3 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-36 bg-gray-200 rounded" />
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50">
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}