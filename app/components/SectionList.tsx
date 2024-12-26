import React from "react";
import Card from "./Card";

type SectionListProps = {
  section: Section;
  cards: Card[];
  addCard: (section: string) => void;
  removeCard: (id: number) => void;
  updateCard: (id: number, title: string) => void;
  onHoverInSection: (section: string, position: number) => void;
  onPutInSection: (id: number) => void;
  currentSectionSelected: { section: string; position: number } | null;
};

const SectionList: React.FC<SectionListProps> = ({
  section,
  cards,
  addCard,
  removeCard,
  updateCard,
  onHoverInSection,
  onPutInSection,
  currentSectionSelected,
}) => {
  const sectionCards = cards
    .filter((card) => card.section === section.title)
    .sort((a, b) => a.position - b.position);

  return (
    <section
      aria-label={section.title}
      className={`min-h-screen w-80 flex-shrink-0 flex flex-col gap-4 box-content border-2 p-2 transition-all
        ${section.color}
        ${
          currentSectionSelected?.section === section.title
            ? "border-lime-300"
            : "border-gray-950"
        }
      `}
      onDragOver={(e) => {
        e.preventDefault();
        onHoverInSection(section.title, sectionCards.length + 1);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const draggedCardId = e.dataTransfer?.getData("cardId");
        if (draggedCardId) {
          onPutInSection(Number(draggedCardId));
        }
      }}
    >
      <header className="flex justify-between">
        <h2 className="text-lg font-semibold select-none">{section.title}</h2>
        <button
          className="mr-1.5 text-lg font-semibold select-none cursor-pointer border-2 border-gray-600 rounded-full w-6 h-6 p-4 flex items-center justify-center
          hover:bg-gray-600 hover:text-white transition-all duration-200
          active:scale-110 active:bg-gray-800 active:text-lime-300
          "
          onClick={() => addCard(section.title)}
        >
          <span className="mb-1"> +</span>
        </button>
      </header>
      {sectionCards.map((card, index) => (
        <Card
          key={card.id}
          {...card}
          removeCard={removeCard}
          updateCard={updateCard}
          onHoverInSection={(_pos: any) =>
            onHoverInSection(section.title, index + 1)
          }
          onPutInSection={() => onPutInSection(card.id)}
        />
      ))}
    </section>
  );
};

export default SectionList;
