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

  const fetchBoards = () => {
    fetch("http://127.0.0.1:8000/api/boards")
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const addCard = async (listId) => {
    const title = newCards[listId];

    if (!title || !title.trim()) return;

    try {
      await fetch("http://127.0.0.1:8000/api/cards", {
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
      await fetch(
        `http://127.0.0.1:8000/api/cards/${cardId}`,
        {
          method: "DELETE",
        }
      );

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceListId = parseInt(
      result.source.droppableId
    );

    const destinationListId = parseInt(
      result.destination.droppableId
    );

    const cardId = parseInt(
      result.draggableId
    );

    const updatedBoards = [...boards];

    updatedBoards.forEach((board) => {
      const sourceList = board.lists.find(
        (list) => list.id === sourceListId
      );

      const destinationList =
        board.lists.find(
          (list) =>
            list.id === destinationListId
        );

      if (!sourceList || !destinationList)
        return;

      const cardIndex =
        sourceList.cards.findIndex(
          (card) => card.id === cardId
        );

      if (cardIndex === -1) return;

      const [movedCard] =
        sourceList.cards.splice(
          cardIndex,
          1
        );

      movedCard.board_list_id =
        destinationListId;

      destinationList.cards.splice(
        result.destination.index,
        0,
        movedCard
      );
    });

    setBoards(updatedBoards);

    try {
      await fetch(
        `http://127.0.0.1:8000/api/cards/${cardId}`,
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Forge 2 Kanban Board</h1>

      {boards.map((board) => (
        <div key={board.id}>
          <h2>{board.name}</h2>

          <DragDropContext
            onDragEnd={handleDragEnd}
          >
            <div className="board">
              {board.lists.map((list) => (
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
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h4>
                                  {card.title}
                                </h4>

                                <p>
                                  {
                                    card.description
                                  }
                                </p>

                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    deleteCard(
                                      card.id
                                    )
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
                          value={
                            newCards[
                              list.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setNewCards({
                              ...newCards,
                              [list.id]:
                                e.target
                                  .value,
                            })
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
          </DragDropContext>
        </div>
      ))}
    </div>
  );
}

export default App;