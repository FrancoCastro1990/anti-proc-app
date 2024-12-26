import React, { useState, useRef, useEffect } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Marcar la tarjeta como no nueva después de la animación
    const timer = setTimeout(() => setIsNew(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleBlur = () => {
    setIsEditing(false);
    if (newTitle !== title) updateCard(id, newTitle);
  };

  const handleDragStart = (e: any) => {
    setIsDragging(true);
    e.dataTransfer.setData("cardId", id.toString());

    // Crear un clon visual de la tarjeta
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const clone = cardRef.current.cloneNode(true) as HTMLElement;

      // Aplicar estilos al clon
      (clone as HTMLElement).style.position = "absolute";
      (clone as HTMLElement).style.top = "-1000px";
      (clone as HTMLElement).style.left = "-1000px";
      (clone as HTMLElement).style.width = `calc(${rect.width}px - 40px)`;
      (clone as HTMLElement).style.height = `${rect.height}px`;
      //(clone as HTMLElement).style.transform = "rotate(1deg)";
      (clone as HTMLElement).style.pointerEvents = "none";
      clone.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      (clone as HTMLElement).id = "dragClone";
      console.log(clone);
      // Agregar el clon al body
      document.body.appendChild(clone);

      // Usar el clon como imagen de arrastre
      e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);

      // Eliminar el clon después de un momento
      requestAnimationFrame(() => {
        const dragClone = document.getElementById("dragClone");
        if (dragClone) {
          dragClone.remove();
        }
      });
    }

    onPutInSection(id);
  };

  // const handleDragEnd = () => {
  //   setIsDragging(false);
  //   setIsDraggedOver(false);
  //   const dragClone = document.getElementById("dragClone");
  //   if (dragClone) {
  //     dragClone.remove();
  //   }
  // };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDraggedOver(false);

    if (cardRef.current) {
      cardRef.current.classList.add("card-drop");
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.classList.remove("card-drop");
        }
      }, 500);
    }

    const dragClone = document.getElementById("dragClone");
    if (dragClone) dragClone.remove();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDraggedOver(true);
    onHoverInSection(section, position);
  };

  return (
    <div
      ref={cardRef}
      className={`p-2 border bg-gray-700 text-white rounded transition-all duration-200 
        ${
          isDraggedOver
            ? "border-lime-400 shadow-lg scale-105"
            : "border-transparent"
        }
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isNew ? "card-new" : ""}
        ${section === "new" ? "bg-green-900" : ""}
        hover:border-gray-500 cursor-grab active:cursor-grabbing select-none
        transform hover:-translate-y-1 hover:shadow-lg`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
        <textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            }
          }}
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
            className="ml-2 p-1 text-sm bg-red-500 rounded-full hover:bg-red-600 
              transition-all transform active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              //class="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
