/*const AdminDashboard = () => {
  return (
    <div>
      <h1>Welcome, Admin 👋</h1>

      <p>
        From here you can manage users, stories, and keep Mozhibu safe.
      </p>

      <ul>
        <li>✔ User moderation</li>
        <li>✔ Story control</li>
        <li>✔ Platform integrity</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
*/

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Stories</p>
          <h2 className="text-3xl font-bold">24</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Authors</p>
          <h2 className="text-3xl font-bold">6</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Reports</p>
          <h2 className="text-3xl font-bold text-red-500">2</h2>
        </div>
      </div>
    </div>
  );
}
