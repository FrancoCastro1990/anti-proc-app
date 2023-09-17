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

  return (
    <main className="flex min-h-screen bg-slate-800 flex-col p-4">
      <h1 className="text-center">Board</h1>
      <div className="flex flex-row justify-around min-w-full mt-1">
        <section className="min-h-fit w-1/3 flex flex-col gap-4">
          <h2 className="text-center pb-2">backlog</h2>
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
          <button
            className="bg-slate-600 shadow-lg rounded-full overflow-hidden p-2 self-end"
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
        </section>
        <section className="min-h-fit w-1/3 flex flex-col gap-1">
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
        <section className="min-h-fit w-1/3 flex flex-col">
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
    </main>
  );
};

export default Board;
