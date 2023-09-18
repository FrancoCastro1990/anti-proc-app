import React, { useEffect, useRef } from "react";

type Prop = {
  title: string;
  section?: string;
  id: number;
  removeCard: Function;
  updateCard: Function;
};

const Card = ({ title, section, id, removeCard, updateCard }: Prop) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardTitle, setCardTitle] = React.useState(title);

  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("drag start", e);
    if (!cardRef.current) return;
    cardRef.current.classList.add("opacity-70");
    e.dataTransfer.effectAllowed = "move";

    const width = cardRef.current.offsetWidth - 24;

    var crt = document.getElementById("drag-image") as HTMLDivElement;
    //crt.style.transform = "scale(0.5)";
    crt.style.opacity = "1";
    crt.style.position = "absolute";
    crt.style.top = "0px";
    crt.style.left = "-" + cardRef.current.offsetWidth + "px";
    crt.style.width = width + "px";
    crt.style.height = 84 + "px";
    crt.classList.add(
      "bg-slate-600",
      "rounded-lg",
      "overflow-hidden",
      "p-2",
      "border-2",
      "border-slate-500"
    );
    crt.innerHTML = cardTitle;
    //e.dataTransfer.setDragImage(cardRef.current, cardRef.current.offsetWidth - 80, 60);
    e.dataTransfer.setDragImage(crt, cardRef.current.offsetWidth - 80, 60);

    e.dataTransfer.setData("cardId", id.toString());
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    cardRef.current.classList.remove("opacity-70");
  };

  return (
    <div
      ref={cardRef}
      className="box-border border-2 border-slate-600 bg-slate-600 shadow-lg rounded-lg overflow-hidden p-2 flex flex-col transition-all ease-in-out duration-300 hover:border-2 hover:border-slate-500"
    >
      <div
        onDoubleClick={() => {
          setIsEditing(!isEditing);
        }}
        className="cursor-text"
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={cardTitle}
            className="bg-slate-500 text-white select-all rounded-md outline-none p-1 shadow-lg w-full"
            onChange={(e) => {
              setCardTitle(e.target.value);
            }}
            onBlur={() => {
              setIsEditing(false);
              updateCard(id, cardTitle);
            }}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                setIsEditing(false);
                updateCard(id, cardTitle);
              }
            }}
          />
        ) : (
          <h3 className="transition ease-in-out p-1 overflow-hidden text-ellipsis whitespace-nowrap w-full select-none hover:bg-slate-500 rounded-md ">
            {title}
          </h3>
        )}
      </div>

      <div className="flex gap-1 self-end ">
        <div
          className="transition-all ease-in-out duration-300 bg-slate-700 shadow-lg rounded-full overflow-hidden p-2 mt-1 w-8 cursor-move hover:transform hover:scale-110"
          draggable={true}
          onDragStart={onDragStart}
          onDragEndCapture={onDragEnd}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            style={{
              fill: "#ffffff",
            }}
            viewBox="0 0 512 512"
          >
            <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96h-96V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96h-32c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9S332.9 384 319.9 384H288v-96h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S384 179.1 384 192.1v32h-96V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z" />
          </svg>
        </div>

        <button
          onClick={() => removeCard(id)}
          className="transition-all ease-in-out duration-300 bg-slate-700 shadow-lg rounded-full overflow-hidden p-2 mt-1 w-8 hover:transform hover:scale-110 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            style={{
              fill: "red",
              margin: "auto",
            }}
            viewBox="0 0 448 512"
          >
            <path d="M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Card;
