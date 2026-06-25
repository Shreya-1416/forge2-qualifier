import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

// ── API helpers ─────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const GridIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const CalIcon = ({ color = "#f59e0b" }) => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const DotsIcon = () => (
  <svg width="18" height="18" fill="#94a3b8" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const TaskIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(139,92,246,0.25)" />
    <path d="M7 12h10M7 8h10M7 16h6" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ListIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(37,99,235,0.25)" />
    <circle cx="8" cy="8" r="1.5" fill="#60a5fa" />
    <circle cx="8" cy="12" r="1.5" fill="#60a5fa" />
    <circle cx="8" cy="16" r="1.5" fill="#60a5fa" />
    <path d="M12 8h5M12 12h5M12 16h5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(34,197,94,0.2)" />
    <path d="M7 12l3.5 3.5L17 9" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(217,119,6,0.2)" />
    <circle cx="12" cy="12" r="5" stroke="#f59e0b" strokeWidth="2" />
    <path d="M12 9v3l2 2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#a855f7">
    <path d="M12 21C12 21 3 14 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14 12 21 12 21z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
  </svg>
);

// ── Column config ──────────────────────────────────────────────────────────
const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    dot: "#8b5cf6",
    btnBg: "linear-gradient(90deg,#7c3aed,#6d28d9)",
    inputBorder: "rgba(124,58,237,.5)",
    inputPlaceholder: "#8b5cf6",
    tagBg: "rgba(124,58,237,.25)",
    tagColor: "#a855f7",
  },
  {
    id: "doing",
    title: "Doing",
    dot: "#3b82f6",
    btnBg: "linear-gradient(90deg,#2563eb,#3b82f6)",
    inputBorder: "rgba(59,130,246,.5)",
    inputPlaceholder: "#3b82f6",
    tagBg: "rgba(37,99,235,.25)",
    tagColor: "#60a5fa",
  },
  {
    id: "done",
    title: "Done",
    dot: "#22c55e",
    btnBg: "linear-gradient(90deg,#16a34a,#22c55e)",
    inputBorder: "rgba(34,197,94,.45)",
    inputPlaceholder: "#22c55e",
    tagBg: "rgba(34,197,94,.2)",
    tagColor: "#4ade80",
  },
];

// ── Card Component ─────────────────────────────────────────────────────────
function Card({ card, col, onDelete, onEdit }) {
  return (
    <div
      style={{
        background: "rgba(7,18,42,.97)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 20,
        padding: "18px 20px",
        marginBottom: 16,
        transition: "transform .2s, box-shadow .2s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(139,92,246,.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            background: col.tagBg,
            color: col.tagColor,
            padding: "5px 14px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {card.label || col.title}
        </span>
        <button
          onClick={() => {}}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <DotsIcon />
        </button>
      </div>

      {/* Title */}
      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "white", margin: "12px 0 6px" }}>
        {card.title}
      </h4>

      {/* Desc */}
      <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: 14 }}>{card.description || ""}</p>

      {/* Meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,.07)",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#cbd5e1", fontSize: 14 }}>
          <UserIcon />
          {card.assignee || "Unassigned"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
          <CalIcon color={card.overdue ? "#f59e0b" : "#4ade80"} />
          <span style={{ color: card.overdue ? "#f59e0b" : "#4ade80", fontWeight: 500 }}>
            {card.dueDisplay || "No due date"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          onClick={() => onEdit(card)}
          style={{
            flex: 1,
            border: "none",
            padding: "10px",
            borderRadius: 10,
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
            transition: "transform .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(card.id)}
          style={{
            flex: 1,
            border: "none",
            padding: "10px",
            borderRadius: 10,
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "linear-gradient(90deg,#ef4444,#dc2626)",
            transition: "transform .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({ card, onSave, onClose }) {
  const [title, setTitle] = useState(card.title);
  const [desc, setDesc] = useState(card.description || "");
  const [tag, setTag] = useState(card.label || "");
  const [due, setDue] = useState(card.dueRaw || "");
  const [assignee, setAssignee] = useState(card.assignee || "");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 480,
          maxWidth: "95%",
          background: "white",
          borderRadius: 24,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ color: "#1e293b", marginBottom: 4 }}>Edit Task</h2>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" style={inputStyle} />
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag (e.g. Backend)" style={inputStyle} />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} style={inputStyle} />
        <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Assignee" style={inputStyle} />

        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button
            onClick={() => onSave({ ...card, title, description: desc, label: tag, due_date: due, assignee })}
            style={{
              flex: 1, border: "none", color: "white", padding: 14, borderRadius: 12,
              cursor: "pointer", fontWeight: 700, fontSize: 15,
              background: "linear-gradient(90deg,#7c3aed,#a855f7)",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, border: "1px solid #e2e8f0", color: "#64748b", padding: 14, borderRadius: 12,
              cursor: "pointer", fontWeight: 600, fontSize: 15, background: "white",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid #dbe2ef",
  outline: "none",
  fontSize: 15,
  color: "#1e293b",
};

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [boards, setBoards] = useState([]);
  const [inputs, setInputs] = useState({ todo: "", doing: "", done: "" });
  const [search, setSearch] = useState("");
  const [editCard, setEditCard] = useState(null);
  const [dragCard, setDragCard] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch boards on mount ───────────────────────────────────────────────
  const fetchBoards = async () => {
    try {
      setError(null);
      const data = await api("/boards");
      setBoards(data);
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0].id);
      } else if (data.length > 0 && !data.find(b => b.id === selectedBoard)) {
        setSelectedBoard(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // ── Derive current board and columns from API data ──────────────────────
  const currentBoard = boards.find(b => b.id === selectedBoard);

  // Build column cards from the board's lists
  const getColumnCards = (colTitle) => {
    if (!currentBoard || !currentBoard.lists) return [];
    const list = currentBoard.lists.find(l => l.name === colTitle);
    if (!list || !list.cards) return [];
    return list.cards.map(c => ({
      ...c,
      tag: c.label || colTitle,
      description: c.description || "",
      dueRaw: c.due_date ? c.due_date.split("T")[0] : "",
      dueDisplay: c.due_date ? new Date(c.due_date).toLocaleDateString() : "No due date",
      overdue: c.due_date ? new Date(c.due_date) < new Date(new Date().toDateString()) : false,
    }));
  };

  // ── Create board (API) ─────────────────────────────────────────────────
  const addBoard = async () => {
    const boardName = prompt("Enter Board Name");
    if (!boardName?.trim()) return;

    try {
      const newBoard = await api("/boards", {
        method: "POST",
        body: JSON.stringify({ name: boardName.trim() }),
      });
      setBoards(prev => [...prev, newBoard]);
      setSelectedBoard(newBoard.id);
    } catch (err) {
      alert("Failed to create board: " + err.message);
    }
  };

  // ── Delete board (API) ─────────────────────────────────────────────────
  const deleteBoard = async (boardId) => {
    const board = boards.find(b => b.id === boardId);
    if (!confirm(`Delete "${board?.name}" and all its cards?`)) return;

    try {
      await api(`/boards/${boardId}`, { method: "DELETE" });
      const remaining = boards.filter(b => b.id !== boardId);
      setBoards(remaining);
      if (selectedBoard === boardId) {
        setSelectedBoard(remaining[0]?.id || null);
      }
    } catch (err) {
      alert("Failed to delete board: " + err.message);
    }
  };

  // ── Create card (API) ──────────────────────────────────────────────────
  const addCard = async (colId) => {
    const val = inputs[colId]?.trim();
    if (!val) return;

    const col = COLUMNS.find(c => c.id === colId);

    // Use boards from state; if currentBoard is stale, refetch from API
    let board = boards.find(b => b.id === selectedBoard);
    if (!board || !board.lists || board.lists.length === 0) {
      // State may be stale after board creation — refetch from API
      try {
        const freshBoards = await api("/boards");
        setBoards(freshBoards);
        board = freshBoards.find(b => b.id === selectedBoard);
      } catch (err) {
        alert("Failed to load board data. Please refresh.");
        return;
      }
    }

    const list = board?.lists?.find(l => l.name === col.title);
    if (!list) {
      alert(`List "${col.title}" not found. Please refresh.`);
      return;
    }

    try {
      await api("/cards", {
        method: "POST",
        body: JSON.stringify({
          board_list_id: list.id,
          title: val,
          label: col.title,
          assignee: "Shreya",
        }),
      });
      setInputs(prev => ({ ...prev, [colId]: "" }));
      await fetchBoards();
    } catch (err) {
      alert("Failed to create card: " + err.message);
    }
  };

  // ── Delete card (API) ──────────────────────────────────────────────────
  const deleteCard = async (cardId) => {
    try {
      await api(`/cards/${cardId}`, { method: "DELETE" });
      await fetchBoards();
    } catch (err) {
      alert("Failed to delete card: " + err.message);
    }
  };

  // ── Save edit (API) ────────────────────────────────────────────────────
  const saveEdit = async (updated) => {
    try {
      await api(`/cards/${updated.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: updated.title,
          description: updated.description,
          label: updated.label,
          due_date: updated.due_date || null,
          assignee: updated.assignee,
        }),
      });
      setEditCard(null);
      await fetchBoards();
    } catch (err) {
      alert("Failed to update card: " + err.message);
    }
  };

  // ── Drag & drop (API) ──────────────────────────────────────────────────
  const handleDragStart = (card, fromCol) => setDragCard({ card, fromCol });

  const handleDrop = async (toCol) => {
    if (!dragCard || dragCard.fromCol === toCol) return;

    // Use boards from state; if currentBoard is stale, refetch from API
    let board = boards.find(b => b.id === selectedBoard);
    if (!board || !board.lists || board.lists.length === 0) {
      try {
        const freshBoards = await api("/boards");
        setBoards(freshBoards);
        board = freshBoards.find(b => b.id === selectedBoard);
      } catch (err) {
        setDragCard(null);
        return;
      }
    }

    const toList = board?.lists?.find(l => l.name === toCol);
    if (!toList) {
      setDragCard(null);
      return;
    }

    try {
      await api(`/cards/${dragCard.card.id}/move`, {
        method: "PUT",
        body: JSON.stringify({ board_list_id: toList.id }),
      });
      await fetchBoards();
    } catch (err) {
      alert("Failed to move card: " + err.message);
    }

    setDragCard(null);
  };

  // ── Search filter (client-side on loaded data) ─────────────────────────
  const filterCards = (list) =>
    list.filter(
      c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase())
    );

  // ── Stats ───────────────────────────────────────────────────────────────
  const allCards = COLUMNS.flatMap(col => getColumnCards(col.title));
  const totalTasks = allCards.length;
  const completed = getColumnCards("Done").length;
  const totalLists = currentBoard?.lists?.length || 0;
  const overdue = allCards.filter(c => c.overdue).length;

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading boards...
      </div>
    );
  }

  return (
    <div style={appStyle}>
      {/* ── HEADER ── */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={logoStyle}><GridIcon /></div>
          <div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.1 }}>Kanban Board</div>
            <div style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>Manage tasks with drag &amp; drop</div>
          </div>
        </div>

        <button onClick={addBoard} style={addBoardBtn}>+ Add New Board</button>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ── ERROR ── */}
        {error && (
          <div style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#fca5a5" }}>
            {error} <button onClick={fetchBoards} style={{ marginLeft: 10, background: "rgba(255,255,255,.1)", border: "none", borderRadius: 6, padding: "4px 10px", color: "white", cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div style={{ display: "flex", gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
          {[
            { icon: <TaskIcon />, count: totalTasks, label: "Total Tasks" },
            { icon: <ListIcon />, count: totalLists, label: "Total Lists" },
            { icon: <CheckIcon />, count: completed, label: "Completed" },
            { icon: <ClockIcon />, count: overdue, label: "Overdue" },
          ].map((s, i) => (
            <div key={i} style={statCard}>
              {s.icon}
              <div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>{s.count}</div>
                <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOARD SELECTOR ── */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "25px" }}>
          {boards.map(board => (
            <div key={board.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setSelectedBoard(board.id)}
                style={{
                  ...boardBtn,
                  background: selectedBoard === board.id
                    ? "linear-gradient(90deg,#7c3aed,#a855f7)"
                    : "rgba(255,255,255,.08)",
                }}
              >
                {board.name}
              </button>
              <button
                onClick={() => deleteBoard(board.id)}
                style={deleteBoardBtn}
                title={`Delete ${board.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 700 }}>
            <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>
              <SearchIcon />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              style={searchInput}
            />
          </div>
        </div>

        {/* ── BOARD ── */}
        {selectedBoard ? (
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", overflowX: "auto", paddingBottom: 20 }}>
            {COLUMNS.map(col => {
              const colCards = filterCards(getColumnCards(col.title));
              return (
                <div
                  key={col.id}
                  style={{ flex: "1 1 340px", minWidth: 300, maxWidth: 460 }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(col.title)}
                >
                  {/* Column Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: col.dot, boxShadow: `0 0 8px ${col.dot}88` }} />
                      <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{col.title}</span>
                    </div>
                    <div style={colCountBadge}>{colCards.length}</div>
                  </div>

                  {/* Column Body */}
                  <div style={colBody}>
                    {colCards.length === 0 && !inputs[col.id] && (
                      <div style={{ textAlign: "center", color: "#475569", padding: "30px 0", fontSize: 14 }}>
                        No tasks yet. Add one below!
                      </div>
                    )}
                    {colCards.map(card => (
                      <div key={card.id} draggable onDragStart={() => handleDragStart(card, col.title)}>
                        <Card card={card} col={col} onDelete={id => deleteCard(id)} onEdit={setEditCard} />
                      </div>
                    ))}

                    {/* Add task input */}
                    <div style={{ marginTop: 8 }}>
                      <input
                        value={inputs[col.id] || ""}
                        onChange={e => setInputs(prev => ({ ...prev, [col.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && addCard(col.id)}
                        placeholder="+ Add a new task..."
                        style={{ ...addCardInput, border: `2px dashed ${col.inputBorder}`, caretColor: col.dot }}
                      />
                      <button onClick={() => addCard(col.id)} style={{ ...addCardBtn, background: col.btnBg }}>
                        + Add Card
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: "center", color: "#475569", padding: "60px 0", fontSize: 16 }}>
              {boards.length === 0 ? "No boards yet. Click \"+ Add New Board\" to get started!" : "Select a board above."}
            </div>
          )
        )}

        {/* ── FOOTER ── */}
        <div style={footer}>
          Made with <HeartIcon /> by Shreya &nbsp;|&nbsp; Forge 2 Qualifier
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editCard && (
        <EditModal card={editCard} onSave={saveEdit} onClose={() => setEditCard(null)} />
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const loadingStyle = {
  fontFamily: "'Inter', sans-serif",
  background: "#050816",
  color: "white",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 18,
};

const appStyle = {
  fontFamily: "'Inter', sans-serif",
  background: "#050816",
  backgroundImage: "radial-gradient(circle at 20% 20%, rgba(124,58,237,.25), transparent 30%), radial-gradient(circle at 80% 80%, rgba(37,99,235,.20), transparent 35%)",
  color: "white",
  minHeight: "100vh",
  padding: "36px 40px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 36,
  maxWidth: 1400,
  margin: "0 auto 36px",
};

const logoStyle = {
  width: 46, height: 46, borderRadius: 14,
  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const addBoardBtn = {
  background: "linear-gradient(90deg,#7c3aed,#6d28d9)",
  border: "none", color: "white", padding: "13px 24px",
  borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 8, transition: "transform .15s",
};

const statCard = {
  flex: "1 1 180px",
  background: "rgba(15,23,42,.85)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20, padding: "20px 24px",
  display: "flex", alignItems: "center", gap: 16,
  backdropFilter: "blur(20px)",
};

const boardBtn = {
  padding: "10px 18px", borderRadius: "12px",
  border: "none", cursor: "pointer", fontWeight: "600", color: "white",
};

const deleteBoardBtn = {
  background: "none", border: "none", color: "#64748b",
  cursor: "pointer", padding: "4px 6px", borderRadius: 8,
  display: "flex", alignItems: "center", transition: "color .15s",
};

const searchInput = {
  width: "100%", padding: "16px 18px 16px 46px",
  borderRadius: 16, border: "1px solid rgba(255,255,255,.08)",
  background: "rgba(15,23,42,.75)", color: "white",
  outline: "none", fontSize: 15,
};

const colCountBadge = {
  width: 40, height: 40, background: "rgba(255,255,255,.07)",
  borderRadius: "50%", display: "flex", alignItems: "center",
  justifyContent: "center", fontSize: 15, fontWeight: 700,
};

const colBody = {
  background: "rgba(7,18,42,.6)",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 24, padding: "18px 16px",
};

const addCardInput = {
  width: "100%", padding: "14px 16px", borderRadius: 14,
  background: "rgba(255,255,255,.03)",
  color: "white", outline: "none", fontSize: 14, marginBottom: 14,
};

const addCardBtn = {
  width: "100%", height: 52, border: "none", borderRadius: 16,
  color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
  transition: "transform .15s",
};

const footer = {
  textAlign: "center", marginTop: 50, color: "#475569", fontSize: 14,
  display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
};
