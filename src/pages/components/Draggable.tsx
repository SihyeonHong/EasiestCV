"use client";

import { useState, useRef } from "react";

export default function Draggable() {
  const [fruitItems, setFruitItems] = useState(["Apple", "Banana", "Orange"]);

  //save reference for dragItem and dragOverItem
  const dragItem = useRef<any>(null); // 내가 드래그중인 아이템
  const dragOverItem = useRef<any>(null); // 내가 드래그하고 있는 아이템이 들어갈 위치

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _fruitItems = [...fruitItems];

    //remove and save the dragged item content
    const draggedItemContent = _fruitItems.splice(dragItem.current, 1)[0];

    //switch the position
    _fruitItems.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setFruitItems(_fruitItems);
  };

  return (
    <div style={{ backgroundColor: "bisque" }}>
      {fruitItems.map((item, index) => (
        <div
          key={index}
          style={{ backgroundColor: "burlywood" }}
          draggable
          onDragStart={(e) => (dragItem.current = index)}
          onDragOver={(e) => {
            e.preventDefault();
            dragOverItem.current = index;
          }}
          onDragEnd={handleSort}
        >
          <h3>{item}</h3>
        </div>
      ))}
    </div>
  );
}
