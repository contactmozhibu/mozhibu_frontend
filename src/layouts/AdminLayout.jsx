import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-5 text-xl font-bold text-pink-600">
          🛡 Admin Panel
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link className="hover:bg-pink-100 p-2 rounded" to="/admin/dashboard">
            📊 Dashboard
          </Link>
          <Link className="hover:bg-pink-100 p-2 rounded" to="/admin/stories">
            📚 Stories
          </Link>
          <Link className="hover:bg-pink-100 p-2 rounded" to="/admin/users">
            👤 Users
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
