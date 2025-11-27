import React, { useEffect, useState } from "react";
import { getTemplates } from "../../api/templateApi";
import { sendEmail, getMyLogs } from "../../api/emailApi";

function extractVars(body) {
  const matches = body.match(/{{(.*?)}}/g) || [];
  return [...new Set(matches.map((m) => m.replace(/[{}]/g, "").trim()))];
}

export default function MarketerDashboard() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [vars, setVars] = useState({});
  const [to, setTo] = useState("");
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const t = await getTemplates();
    setTemplates(t.data);
    const l = await getMyLogs();
    setLogs(l.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSelect = (id) => {
    const tpl = templates.find((t) => t._id === id);
    setSelected(tpl);
    const keys = extractVars(tpl.body);
    const initial = {};
    keys.forEach((k) => (initial[k] = ""));
    setVars(initial);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await sendEmail({
        templateId: selected._id,
        toEmail: to,          // IMPORTANT: must be toEmail
        variables: vars,
      });
      setMsg("Email sent!");
      setTo("");
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to send email");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketer Dashboard</h1>
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

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Choose Template</h2>
          <ul className="space-y-2">
            {templates.map((t) => (
              <li
                key={t._id}
                className={`border p-2 rounded cursor-pointer ${
                  selected?._id === t._id ? "border-blue-500" : ""
                }`}
                onClick={() => handleSelect(t._id)}
              >
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-slate-500">{t.subject}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Send Email</h2>
          {!selected && <p className="text-sm">Select a template first.</p>}
          {selected && (
            <form onSubmit={handleSend} className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Recipient email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                type="email"
                required
              />
              {Object.keys(vars).map((key) => (
                <input
                  key={key}
                  className="w-full border px-3 py-2 rounded"
                  placeholder={key}
                  value={vars[key]}
                  onChange={(e) =>
                    setVars({ ...vars, [key]: e.target.value })
                  }
                  required
                />
              ))}
              {msg && <p className="text-sm">{msg}</p>}
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Send Email
              </button>
            </form>
          )}
        </section>

        <section className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="font-semibold mb-3">My Email Logs</h2>
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
    </div>
  );
}
