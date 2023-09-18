"use client";

import React from "react";
import Card from "../components/Card";

export const metadata = {
  title: "Board",
  description: "board dashboard",
};

const Board = () => {
  const [cards, setCards] = React.useState([
    { id: 1, title: "aprender Next.js", section: "backlog" },
    { id: 2, title: "aprender back con node", section: "backlog" },
    {
      id: 3,
      title: "levantar docker con base de dato en progress",
      section: "ready",
    },
  ]);

  const addCard = () => {
    const newCard = {
      id: Math.random(),
      title: "new card",
      section: "backlog",
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const updateCard = (id: number, title: string) => {
    const newCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, title };
      }
      return card;
    });
    setCards(newCards);
  };

  const moveCard = (id: number, section: string) => {
    const newCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, section };
      }
      return card;
    });
    setCards(newCards);
  };

  return (
    <main className="flex min-h-screen bg-slate-800 flex-col p-4 overflow-hidden">
      <h1 className="text-center">Board</h1>
      <div className="flex flex-row gap-1 min-w-full mt-1 min-h-full">
        <section
          className="min-h-screen w-80 flex flex-col gap-4 box-content border-2 border-gray-600 rounded-md p-2 "
          onDragEnter={(e) => {
            console.log("drag enter in backlog", e);
            e.stopPropagation();
            e.currentTarget.classList.add("border-dotted");
          }}
          onDragLeave={(e) => {
            console.log("drag leave in backlog", e);
            e.stopPropagation();
            e.currentTarget.classList.remove("border-dotted");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            return false;
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove("border-dotted");
            e.stopPropagation();
            const cardId = e.dataTransfer.getData("cardId");
            e.currentTarget.classList.remove("opacity-50");
            e.dataTransfer.clearData();
            const card = cards.find((card) => card.id === Number(cardId));
            if (card) {
              moveCard(card.id, "backlog");
            }
            const dragImages = document.querySelectorAll("#drag-image");
            dragImages.forEach((image) => {
              image.innerHTML = "";
            });
            return false;
          }}
        >
          <h2 className="text-center pb-2">backlog</h2>
          <button
            className="transition-all ease-in-out duration-300 bg-slate-600 shadow-lg rounded-full overflow-hidden p-2 self-end hover:transform hover:scale-110 "
            onClick={addCard}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              style={{
                fill: "#04ff00",
              }}
              viewBox="0 0 448 512"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </button>
          {cards.map((card) => {
            return (
              card.section === "backlog" && (
                <Card
                  key={card.id}
                  id={card.id}
                  removeCard={removeCard}
                  title={card.title}
                  updateCard={updateCard}
                />
              )
            );
          })}
        </section>
        <section
          className="min-h-screen w-80 flex flex-col gap-4 box-content border-2 border-gray-600 rounded-md p-2"
          onDragEnter={(e) => {
            e.currentTarget.classList.add("border-dotted");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-dotted");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            return false;
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove("border-dotted");

            e.stopPropagation();
            const cardId = e.dataTransfer.getData("cardId");
            e.currentTarget.classList.remove("opacity-50");
            e.dataTransfer.clearData();
            const card = cards.find((card) => card.id === Number(cardId));
            if (card) {
              moveCard(card.id, "in-progress");
            }
            const dragImages = document.querySelectorAll("#drag-image");
            dragImages.forEach((image) => {
              image.innerHTML = "";
            });
            return false;
          }}
        >
          <h2 className="text-center pb-2">in progress</h2>
          {cards.map((card) => {
            return (
              card.section === "in-progress" && (
                <Card
                  key={card.id}
                  id={card.id}
                  removeCard={removeCard}
                  title={card.title}
                  updateCard={updateCard}
                />
              )
            );
          })}
        </section>
        <section
          className="min-h-screen w-80 flex flex-col gap-4 box-content border-2 border-gray-600 rounded-md p-2"
          onDragEnter={(e) => {
            e.currentTarget.classList.add("border-dotted");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-dotted");
          }}
          onDragOver={(e) => {
            e.preventDefault();
            return false;
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove("border-dotted");

            e.stopPropagation();
            const cardId = e.dataTransfer.getData("cardId");
            e.currentTarget.classList.remove("opacity-50");
            e.dataTransfer.clearData();

            const card = cards.find((card) => card.id === Number(cardId));
            if (card) {
              moveCard(card.id, "ready");
            }
            const dragImages = document.querySelectorAll("#drag-image");
            dragImages.forEach((image) => {
              image.innerHTML = "";
            });
            return false;
          }}
        >
          <h2 className="text-center pb-2">ready</h2>
          {cards.map((card) => {
            return (
              card.section === "ready" && (
                <Card
                  key={card.id}
                  id={card.id}
                  removeCard={removeCard}
                  title={card.title}
                  updateCard={updateCard}
                />
              )
            );
          })}
        </section>
      </div>
      <div id="drag-image"></div>
    </main>
  );
};

export default Board;
