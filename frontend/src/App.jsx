import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [rules, setRules] = useState([]);

  const [form, setForm] = useState({
    keyword: "",
    match_type: "contains",
    action_type: "highlight",
    color: "#ffff00",
    tag: ""
  });

  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadRules = async () => {
    const res = await fetch("http://localhost:5000/rules");
    const data = await res.json();
    setRules(data);
  };

  useEffect(() => {
    loadRules();
  }, []);

  // Add rule
  const addRule = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({
      keyword: "",
      match_type: "contains",
      action_type: "highlight",
      color: "#ffff00",
      tag: ""
    });

    loadRules();
  };

  //Edit rule
  const startEdit = (rule) => {
  setEditingId(rule.id);
  setForm({
    keyword: rule.keyword,
    match_type: rule.match_type,
    action_type: rule.action_type,
    color: rule.color || "#ffff00",
    tag: rule.tag || ""
  });
};

const saveEdit = async (e) => {
  e.preventDefault();

  await fetch(`http://localhost:5000/rules/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });

  setEditingId(null);
  setForm({
    keyword: "",
    match_type: "contains",
    action_type: "highlight",
    color: "#ffff00",
    tag: ""
  });

  loadRules();
};

  //Delete rule
  const deleteRule = async (id) => {
    await fetch(`http://localhost:5000/rules/${id}`, { method: "DELETE" });
    loadRules();
  };

  const processText = async () => {
    const res = await fetch("http://localhost:5000/process-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setOutput(data.processedHtml);
  };

  return (
    <div className="app">
      <h2>Rule Filter Tester</h2>

      <div className="card">
        <form className="rule-form" onSubmit={editingId ? saveEdit : addRule}>
          <input
            placeholder="keyword"
            value={form.keyword}
            onChange={(e) => setForm({ ...form, keyword: e.target.value })}
          />

          <select
            value={form.match_type}
            onChange={(e) => setForm({ ...form, match_type: e.target.value })}
          >
            <option value="contains">contains</option>
            <option value="startsWith">startsWith</option>
            <option value="exact">exact</option>
          </select>

          <select
            value={form.action_type}
            onChange={(e) => setForm({ ...form, action_type: e.target.value })}
          >
            <option value="highlight">highlight</option>
            <option value="tooltip">tooltip</option>
          </select>

          {form.action_type === "highlight" && (
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          )}

          {form.action_type === "tooltip" && (
            <input
              placeholder="tag (e.g. IMPORTANT)"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            />
          )}

          <button className="btn" type="submit">{editingId ? "Save Rule" : "Add Rule"}</button>
        </form>

        <ul className="rule-list">
          {rules.map((r) => (
            <li className="rule-item" key={r.id}>
              {r.action_type === "highlight" && (
                <span className="swatch" style={{ background: r.color }} />
              )}
              <span className="rule-label">
                {r.keyword} — {r.match_type} — {r.action_type}
                {r.action_type === "tooltip" && r.tag ? ` [${r.tag}]` : ""}
              </span>
              <span className="rule-actions">
                <button className="btn btn-secondary" onClick={() => startEdit(r)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteRule(r.id)}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Text Processor</h2>

        <textarea
          rows="5"
          placeholder="Write text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />

        <button className="btn" style={{ marginTop: 10 }} onClick={processText}>Process Text</button>

        <h3>Output</h3>

        <div className="output-box" dangerouslySetInnerHTML={{ __html: output }} />
      </div>
    </div>
  );
}