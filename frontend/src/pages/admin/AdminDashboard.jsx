import React, { useEffect, useState } from "react";
import {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
} from "../../api/templateApi";
import { getAllLogs } from "../../api/emailApi";
import { getUsers, updateUserRole, deleteUser } from "../../api/userApi";

export default function AdminDashboard() {
  // template state
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templates, setTemplates] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // logs
  const [logs, setLogs] = useState([]);

  // users
  const [users, setUsers] = useState([]);

  const load = async () => {
    const t = await getTemplates();
    setTemplates(t.data);
    const l = await getAllLogs();
    setLogs(l.data);
    const u = await getUsers();
    setUsers(u.data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setSubject("");
    setBody("");
    setEditingId(null);
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateTemplate(editingId, { name, subject, body });
    } else {
      await createTemplate({ name, subject, body });
    }
    resetForm();
    load();
  };

  const handleEditClick = (tpl) => {
    setEditingId(tpl._id);
    setName(tpl.name);
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    await deleteTemplate(id);
    load();
  };

  const handleRoleChange = async (id, newRole) => {
    await updateUserRole(id, newRole);
    load();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="px-4 py-1 rounded bg-red-500 text-white"
        >
          Logout
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Template form */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">
            {editingId ? "Edit Template" : "Create Template"}
          </h2>
          <form onSubmit={handleTemplateSubmit} className="space-y-3">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded h-40"
              placeholder="Body (HTML with {{name}} etc)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Template list */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Email Templates</h2>
          <div className="space-y-2 max-h-80 overflow-auto text-sm">
            {templates.map((tpl) => (
              <div key={tpl._id} className="border p-2 rounded">
                <div className="font-medium">{tpl.name}</div>
                <div className="text-xs text-slate-500 mb-1">
                  {tpl.subject}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                    onClick={() => handleEditClick(tpl)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                    onClick={() => handleDeleteClick(tpl._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* User management */}
      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">User Management</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-2 py-1 text-left">Email</th>
                <th className="border px-2 py-1 text-left">Role</th>
                <th className="border px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value)
                      }
                      className="border px-1 py-0.5 rounded"
                    >
                      <option value="admin">admin</option>
                      <option value="marketer">marketer</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email logs */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Email Logs</h2>
        <div className="space-y-2 max-h-64 overflow-auto text-sm">
          {logs.map((log) => (
            <div key={log._id} className="border p-2 rounded">
              <div>
                <b>To:</b> {log.toEmail}
              </div>
              <div>
                <b>Template:</b> {log.template?.name}
              </div>
              <div>
                <b>Status:</b> {log.success ? "Success" : "Failed"}
              </div>
              <div className="text-xs text-slate-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
