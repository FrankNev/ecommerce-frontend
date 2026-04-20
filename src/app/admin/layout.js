import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: {
    default: 'Panel de administración',
    template: '%s | Admin',
  },
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar permanente */}
        <AdminSidebar />

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}