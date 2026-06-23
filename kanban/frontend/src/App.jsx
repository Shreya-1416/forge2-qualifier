import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "./App.css";



function App() {
  const [boards, setBoards] = useState([]);
  const [newCards, setNewCards] = useState({});
  const [searchTerm, setSearchTerm] =
  useState("");

const [editingCard, setEditingCard] =
  useState(null);

  const API =
    "https://forge2-qualifier-shreya.onrender.com/api";

  const fetchBoards = async () => {
    try {
      const res = await fetch(`${API}/boards`);
      const data = await res.json();

      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const addCard = async (listId) => {
    const title = newCards[listId];

    if (!title?.trim()) return;

    try {
      await fetch(`${API}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_list_id: listId,
          title,
          description: "New Task",
        }),
      });

      setNewCards({
        ...newCards,
        [listId]: "",
      });

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await fetch(`${API}/cards/${cardId}`, {
        method: "DELETE",
      });

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const destinationListId = parseInt(
      result.destination.droppableId
    );

    const cardId = parseInt(
      result.draggableId
    );

    try {
      await fetch(
        `${API}/cards/${cardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            board_list_id:
              destinationListId,
          }),
        }
      );

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };
 
  const updateCard = async () => {
  try {
    const res = await fetch(
      `${API}/cards/${editingCard.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_list_id:
            editingCard.board_list_id,

          title:
            editingCard.title,

          description:
            editingCard.description,

          label:
            editingCard.label,

          assignee:
            editingCard.assignee,

          due_date:
            editingCard.due_date,
        }),
      }
    );

    console.log(
      await res.text()
    );

    setEditingCard(null);

    fetchBoards();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container">
      <div className="hero">
  <h1>Kanban Board</h1>
  <p>
    Manage tasks with drag & drop
  </p>
</div>

<div className="stats">
  <div className="stat-card">
    <h3>
      {boards.reduce(
        (total, board) =>
          total +
          board.lists.reduce(
            (sum, list) =>
              sum +
              (list.cards?.length || 0),
            0
          ),
        0
      )}
    </h3>
    <p>Total Tasks</p>
  </div>

  <div className="stat-card">
    <h3>{boards.length}</h3>
    <p>Boards</p>
  </div>
</div>

<div className="search-box">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />
</div>

{boards.length === 0 ? (
        <div className="empty-state">
          <h2>No boards found</h2>

          <a
            href={`${API}/seed`}
            target="_blank"
            rel="noreferrer"
          >
            Seed Database
          </a>
        </div>
      ) : (
        boards.map((board) => (
          <DragDropContext
            key={board.id}
            onDragEnd={handleDragEnd}
          >
            <div className="board">
              {board.lists?.map((list) => (
                <Droppable
                  key={list.id}
                  droppableId={String(list.id)}
                >
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="column-header">
                        <span className="column-dot"></span>

                        <div className="column-title">
                          {list.name}
                        </div>

                        <span className="task-count">
                          {(list.cards || []).length}
                        </span>
                      </div>

                      {(list.cards || [])
  .filter((card) =>
    card.title
      ?.toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
  )
  .map(
                        (card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={String(
                              card.id
                            )}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="card"
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="card-top">
                                  <span className="card-tag">
  {card.label || "Task"}
</span>
                                </div>

                                <h4>
                                  {card.title}
                                </h4>

                                <p>
                                  {
                                    card.description
                                  }
                                </p>
                                <div className="card-meta">
  <span>
    👤{" "}
    {card.assignee ||
      "Unassigned"}
  </span>

  {card.due_date && (
    <span>
      📅 {card.due_date}
    </span>
  )}
</div>

                                <div className="card-actions">
  <button
    className="edit-btn"
    onClick={() =>
  setEditingCard({
    ...card,
    board_list_id: list.id,
  })
}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() =>
      deleteCard(card.id)
    }
  >
    Delete
  </button>
</div>
                              </div>
                            )}
                          </Draggable>
                        )
                      )}

                      {provided.placeholder}

                      <div className="add-card">
                        <input
                          type="text"
                          placeholder="Add a new task..."
                          value={
                            newCards[
                              list.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setNewCards({
                              ...newCards,
                              [list.id]:
                                e.target.value,
                            })
                          }
                        />

                        <button
                          onClick={() =>
                            addCard(list.id)
                          }
                        >
                          + Add Card
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        ))
      )}
      {editingCard && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Edit Task</h2>

      <input
        type="text"
        value={editingCard.title}
        onChange={(e) =>
          setEditingCard({
            ...editingCard,
            title: e.target.value,
          })
        }
      />

      <textarea
        value={
          editingCard.description ||
          ""
        }
        onChange={(e) =>
          setEditingCard({
            ...editingCard,
            description:
              e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Label"
        value={
          editingCard.label || ""
        }
        onChange={(e) =>
          setEditingCard({
            ...editingCard,
            label: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Assignee"
        value={
          editingCard.assignee ||
          ""
        }
        onChange={(e) =>
          setEditingCard({
            ...editingCard,
            assignee:
              e.target.value,
          })
        }
      />

      <input
        type="date"
        value={
          editingCard.due_date || ""
        }
        onChange={(e) =>
          setEditingCard({
            ...editingCard,
            due_date:
              e.target.value,
          })
        }
      />

      <div className="modal-actions">
        <button
  className="save-btn"
  onClick={() => {
    console.log("SAVE CLICKED");
    updateCard();
  }}
>
  Save Changes
</button>

        <button
          className="delete-btn"
          onClick={() =>
            setEditingCard(null)
          }
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;