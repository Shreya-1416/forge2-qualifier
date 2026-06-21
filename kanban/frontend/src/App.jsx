import { useEffect, useState } from "react";
import "./App.css";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function App() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");

  const loadBoards = () => {
    fetch("http://127.0.0.1:8000/api/boards")
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const addCard = async (listId) => {
    if (!title.trim()) return;

    try {
      await fetch("http://127.0.0.1:8000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_list_id: listId,
          title: title,
          description: "New Task",
        }),
      });

      setTitle("");
      loadBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCard = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/cards/${id}`, {
        method: "DELETE",
      });

      loadBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedBoards = [...boards];

    const board = updatedBoards[0];

    const sourceList = board.lists.find(
      (list) => list.id.toString() === source.droppableId
    );

    const destList = board.lists.find(
      (list) => list.id.toString() === destination.droppableId
    );

    const [movedCard] = sourceList.cards.splice(
      source.index,
      1
    );

    destList.cards.splice(
      destination.index,
      0,
      movedCard
    );

    setBoards(updatedBoards);

    try {
      await fetch(
        `http://127.0.0.1:8000/api/cards/${movedCard.id}/move`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            board_list_id: destList.id,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Forge 2 Kanban Board</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        {boards.map((board) => (
          <div key={board.id}>
            <h2>{board.name}</h2>

            <div className="board">
              {(board.lists || []).map((list) => (
                <Droppable
                  key={list.id}
                  droppableId={list.id.toString()}
                >
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h3>{list.name}</h3>

                      {(list.cards || []).map(
                        (card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="card"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h4>{card.title}</h4>

                                <p>
                                  {card.description}
                                </p>

                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    deleteCard(card.id)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </Draggable>
                        )
                      )}

                      {provided.placeholder}

                      <div className="add-card">
                        <input
                          type="text"
                          placeholder="New task"
                          value={title}
                          onChange={(e) =>
                            setTitle(e.target.value)
                          }
                        />

                        <button
                          onClick={() =>
                            addCard(list.id)
                          }
                        >
                          Add Card
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}

export default App;