import { useState } from "react";

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

const INITIAL_CARDS = {
  todo: [
    {
      id: 1,
      title: "Setup Laravel Backend",
      tag: "Backend",
      desc: "Complete backend setup",
      assignee: "Shreya",
      due: "Jun 25, 2026",
      overdue: true,
    },
  ],
  doing: [
    {
      id: 2,
      title: "Build React Frontend",
      tag: "Frontend",
      desc: "Create Kanban UI",
      assignee: "Shreya",
      due: "Jun 27, 2026",
      overdue: true,
    },
  ],
  done: [
    {
      id: 3,
      title: "Configure Hermes",
      tag: "AI",
      desc: "Memory + cron working",
      assignee: "Shreya",
      due: "Jun 22, 2026",
      overdue: false,
    },
  ],
};

let nextId = 10;

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
          {card.tag}
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
      <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: 14 }}>{card.desc}</p>

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
          {card.assignee}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
          <CalIcon color={card.overdue ? "#f59e0b" : "#4ade80"} />
          <span style={{ color: card.overdue ? "#f59e0b" : "#4ade80", fontWeight: 500 }}>{card.due}</span>
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
  const [desc, setDesc] = useState(card.desc);
  const [tag, setTag] = useState(card.tag);
  const [due, setDue] = useState(card.due);

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

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          style={inputStyle}
        />
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          placeholder="Tag (e.g. Backend)"
          style={inputStyle}
        />
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
        />
        <input
          value={due}
          onChange={e => setDue(e.target.value)}
          placeholder="Due date (e.g. Jun 30, 2026)"
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button
            onClick={() => onSave({ ...card, title, desc, tag, due })}
            style={{
              flex: 1,
              border: "none",
              color: "white",
              padding: 14,
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              background: "linear-gradient(90deg,#7c3aed,#a855f7)",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              border: "1px solid #e2e8f0",
              color: "#64748b",
              padding: 14,
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              background: "white",
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
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [inputs, setInputs] = useState({ todo: "", doing: "", done: "" });
  const [search, setSearch] = useState("");
  const [editCard, setEditCard] = useState(null);
  const [dragCard, setDragCard] = useState(null);

  const totalTasks = Object.values(cards).flat().length;
  const completed = cards.done.length;
  const totalLists = COLUMNS.length;
  const overdue = Object.values(cards)
    .flat()
    .filter(c => c.overdue).length;

  const addCard = (colId) => {
    const val = inputs[colId].trim();
    if (!val) return;
    const col = COLUMNS.find(c => c.id === colId);
    setCards(prev => ({
      ...prev,
      [colId]: [
        ...prev[colId],
        {
          id: nextId++,
          title: val,
          tag: col.title,
          desc: "",
          assignee: "Shreya",
          due: "TBD",
          overdue: false,
        },
      ],
    }));
    setInputs(prev => ({ ...prev, [colId]: "" }));
  };

  const deleteCard = (colId, cardId) => {
    setCards(prev => ({
      ...prev,
      [colId]: prev[colId].filter(c => c.id !== cardId),
    }));
  };

  const saveEdit = (updated) => {
    setCards(prev => {
      const next = {};
      for (const k of Object.keys(prev)) {
        next[k] = prev[k].map(c => (c.id === updated.id ? updated : c));
      }
      return next;
    });
    setEditCard(null);
  };

  const filterCards = (list) =>
    list.filter(
      c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.desc.toLowerCase().includes(search.toLowerCase())
    );

  // Drag & drop
  const handleDragStart = (card, fromCol) => setDragCard({ card, fromCol });
  const handleDrop = (toCol) => {
    if (!dragCard || dragCard.fromCol === toCol) return;
    setCards(prev => ({
      ...prev,
      [dragCard.fromCol]: prev[dragCard.fromCol].filter(c => c.id !== dragCard.card.id),
      [toCol]: [...prev[toCol], dragCard.card],
    }));
    setDragCard(null);
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#050816",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(124,58,237,.25), transparent 30%), radial-gradient(circle at 80% 80%, rgba(37,99,235,.20), transparent 35%)",
        color: "white",
        minHeight: "100vh",
        padding: "36px 40px",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 36,
          maxWidth: 1400,
          margin: "0 auto 36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GridIcon />
          </div>
          <div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.1 }}>Kanban Board</div>
            <div style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>Manage tasks with drag &amp; drop</div>
          </div>
        </div>

        <button
          style={{
            background: "linear-gradient(90deg,#7c3aed,#6d28d9)",
            border: "none",
            color: "white",
            padding: "13px 24px",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "transform .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          + Add New Board
        </button>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ── STAT CARDS ── */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 36,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: <TaskIcon />, count: totalTasks, label: "Total Tasks" },
            { icon: <ListIcon />, count: totalLists, label: "Total Lists" },
            { icon: <CheckIcon />, count: completed, label: "Completed" },
            { icon: <ClockIcon />, count: overdue, label: "Overdue" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 180px",
                background: "rgba(15,23,42,.85)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                backdropFilter: "blur(20px)",
              }}
            >
              {s.icon}
              <div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>{s.count}</div>
                <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 700 }}>
            <div
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <SearchIcon />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              style={{
                width: "100%",
                padding: "16px 18px 16px 46px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(15,23,42,.75)",
                color: "white",
                outline: "none",
                fontSize: 15,
              }}
            />
          </div>
        </div>

        {/* ── BOARD ── */}
        <div
          style={{
            display: "flex",
            gap: 28,
            alignItems: "flex-start",
            overflowX: "auto",
            paddingBottom: 20,
          }}
        >
          {COLUMNS.map(col => {
            const colCards = filterCards(cards[col.id]);
            return (
              <div
                key={col.id}
                style={{ flex: "1 1 340px", minWidth: 300, maxWidth: 460 }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(col.id)}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: col.dot,
                        boxShadow: `0 0 8px ${col.dot}88`,
                      }}
                    />
                    <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{col.title}</span>
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "rgba(255,255,255,.07)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {colCards.length}
                  </div>
                </div>

                {/* Column Body */}
                <div
                  style={{
                    background: "rgba(7,18,42,.6)",
                    border: "1px solid rgba(255,255,255,.07)",
                    borderRadius: 24,
                    padding: "18px 16px",
                  }}
                >
                  {/* Cards */}
                  {colCards.length === 0 && !inputs[col.id] && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#475569",
                        padding: "30px 0",
                        fontSize: 14,
                      }}
                    >
                      No tasks yet. Add one below!
                    </div>
                  )}
                  {colCards.map(card => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card, col.id)}
                    >
                      <Card
                        card={card}
                        col={col}
                        onDelete={id => deleteCard(col.id, id)}
                        onEdit={setEditCard}
                      />
                    </div>
                  ))}

                  {/* Add task input */}
                  <div style={{ marginTop: 8 }}>
                    <input
                      value={inputs[col.id]}
                      onChange={e =>
                        setInputs(prev => ({ ...prev, [col.id]: e.target.value }))
                      }
                      onKeyDown={e => e.key === "Enter" && addCard(col.id)}
                      placeholder="+ Add a new task..."
                      style={{
                        
                        padding: "14px 16px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,.03)",
                        border: `2px dashed ${col.inputBorder}`,
                        color: "white",
                        outline: "none",
                        fontSize: 14,
                        marginBottom: 14,
                        caretColor: col.dot,
                      }}
                    />
                    <button
                      onClick={() => addCard(col.id)}
                      style={{
                        width: "100%",
                        height: 52,
                        border: "none",
                        borderRadius: 16,
                        color: "white",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: col.btnBg,
                        transition: "transform .15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      + Add Card
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            textAlign: "center",
            marginTop: 50,
            color: "#475569",
            fontSize: 14,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
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