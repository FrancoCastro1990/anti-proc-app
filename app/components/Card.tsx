import React, { useState, useRef } from "react";

type CardProps = {
  id: number;
  title: string;
  section: string;
  position: number;
  removeCard: (id: number) => void;
  updateCard: (id: number, title: string) => void;
  onHoverInSection: (section: string, position: number) => void;
  onPutInSection: (id: number) => void;
};

const Card: React.FC<CardProps> = ({
  id,
  title,
  section,
  position,
  removeCard,
  updateCard,
  onHoverInSection,
  onPutInSection,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (newTitle !== title) updateCard(id, newTitle);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(true);
    onHoverInSection(section, position);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (cardRef.current) {
      // Crear una copia del elemento para usar como imagen de arrastre
      const rect = cardRef.current.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#374151"; // bg-gray-700
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "14px sans-serif";
        ctx.fillText(title, 10, 25);
      }

      // Establecer la imagen de arrastre
      e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
    }

    e.dataTransfer.setData("cardId", id.toString());
    onPutInSection(id);
  };

  return (
    <div
      ref={cardRef}
      className={`p-2 border bg-gray-700 text-white rounded transition-all duration-200 
        ${isDraggedOver ? "border-lime-400 shadow-lg" : "border-transparent"}
        hover:border-gray-500`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDraggedOver(false)}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDraggedOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggedOver(false);
        const draggedCardId = e.dataTransfer.getData("cardId");
        if (draggedCardId) {
          onPutInSection(Number(draggedCardId));
        }
      }}
    >
      {isEditing ? (
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="bg-gray-600 text-white p-1 rounded w-full"
        />
      ) : (
        <div className="flex justify-between items-center">
          <h3 onDoubleClick={() => setIsEditing(true)} className="flex-1">
            {title}
          </h3>
          <button
            onClick={() => removeCard(id)}
            className="ml-2 px-2 py-1 text-sm bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
