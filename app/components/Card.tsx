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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  return (
    <div className="bg-slate-600 shadow-lg rounded-lg overflow-hidden p-2 flex flex-col">
      <div
        onDoubleClick={() => {
          setIsEditing(!isEditing);
        }}
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
          <h3 className="p-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {title}
          </h3>
        )}
      </div>

      <button
        onClick={() => removeCard(id)}
        className="bg-slate-700 shadow-lg rounded-full overflow-hidden p-2 mt-1 w-8 self-end"
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
  );
};

export default Card;
