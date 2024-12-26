"use client";

import React, { useCallback, useState } from "react";
import SectionList from "../components/SectionList";

const Board = () => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 4,
      title: "uno",
      section: "backlog",
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      title: "dos",
      section: "backlog",
      position: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "tres",
      section: "backlog",
      position: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "levantar docker con base de dato en progress",
      section: "ready",
      position: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [sections] = useState<Section[]>([
    { id: 1, title: "backlog" },
    { id: 2, title: "in-progress" },
    { id: 3, title: "ready" },
    { id: 4, title: "new", color: "bg-lime-900" },
  ]);

  const [currentSectionSelected, setCurrentSectionSelected] = useState<{
    section: string;
    position: number;
  } | null>(null);

  const addCard = useCallback(
    (section: string) => {
      const newCard: Card = {
        id: Math.random(),
        title: `New card ${
          cards.filter((c) => c.section === section).length + 1
        }`,
        section,
        position: cards.filter((c) => c.section === section).length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCards((prev) => [...prev, newCard]);
    },
    [cards]
  );

  const removeCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const updateCard = useCallback((id: number, title: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title, updatedAt: new Date() } : card
      )
    );
  }, []);

  const moveCard = useCallback(
    (id: number, newSection: string, newPosition: number) => {
      setCards((prevCards) => {
        const movingCard = prevCards.find((card) => card.id === id);
        if (!movingCard) return prevCards;

        const oldSection = movingCard.section;
        const oldPosition = movingCard.position;

        // Si es la misma sección, manejamos el reordenamiento
        if (oldSection === newSection) {
          return prevCards
            .map((card) => {
              // Si es la tarjeta que estamos moviendo
              if (card.id === id) {
                return { ...card, position: newPosition };
              }

              // Si es una tarjeta en la misma sección
              if (card.section === newSection) {
                if (oldPosition < newPosition) {
                  // Moviendo hacia abajo
                  if (
                    card.position <= newPosition &&
                    card.position > oldPosition
                  ) {
                    return { ...card, position: card.position - 1 };
                  }
                } else {
                  // Moviendo hacia arriba
                  if (
                    card.position >= newPosition &&
                    card.position < oldPosition
                  ) {
                    return { ...card, position: card.position + 1 };
                  }
                }
              }
              return card;
            })
            .sort((a, b) => {
              if (a.section === b.section) {
                return a.position - b.position;
              }
              return 0;
            });
        }

        // Movimiento entre diferentes secciones
        // 1. Remover la tarjeta que se está moviendo
        const remainingCards = prevCards.filter((card) => card.id !== id);

        // 2. Crear la tarjeta actualizada con su nueva sección y posición
        const updatedCard = {
          ...movingCard,
          section: newSection,
          position: newPosition,
        };

        // 3. Ajustar las posiciones en ambas secciones
        const updatedCards = remainingCards.map((card) => {
          // Ajustar posiciones en la sección destino
          if (card.section === newSection) {
            if (card.position >= newPosition) {
              return { ...card, position: card.position + 1 };
            }
          }

          // Ajustar posiciones en la sección origen
          if (card.section === oldSection) {
            if (card.position > oldPosition) {
              return { ...card, position: card.position - 1 };
            }
          }

          return card;
        });

        // 4. Combinar y ordenar todas las tarjetas
        const allCards = [...updatedCards, updatedCard];

        // 5. Asegurar que las posiciones sean secuenciales dentro de cada sección
        const sections = [...new Set(allCards.map((card) => card.section))];

        return sections.flatMap((section) => {
          const sectionCards = allCards
            .filter((card) => card.section === section)
            .sort((a, b) => a.position - b.position);

          // Reasignar posiciones secuencialmente
          return sectionCards.map((card, index) => ({
            ...card,
            position: index + 1,
          }));
        });
      });
    },
    []
  );
  const onHoverInSection = useCallback((section: string, position: number) => {
    setCurrentSectionSelected({ section, position });
  }, []);

  const onPutInSection = useCallback(
    (id: number) => {
      if (currentSectionSelected) {
        moveCard(
          id,
          currentSectionSelected.section,
          currentSectionSelected.position || 1
        );
        setCurrentSectionSelected(null);
      }
    },
    [currentSectionSelected, moveCard]
  );

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col p-4 relative">
      <h1 className="text-center">Board</h1>
      <div className="flex flex-row min-w-full mt-1 min-h-full">
        {sections.map((section) => (
          <SectionList
            key={section.id}
            section={section}
            cards={cards}
            addCard={addCard}
            removeCard={removeCard}
            updateCard={updateCard}
            onHoverInSection={onHoverInSection}
            onPutInSection={onPutInSection}
            currentSectionSelected={currentSectionSelected}
          />
        ))}
      </div>
    </main>
  );
};

export default Board;
