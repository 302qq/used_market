import React, { useState } from "react";
import Button from "./Button.jsx";

export default function ItemCard({ item }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="itemCard">
      {imageFailed ? (
        <div className="cardImageFallback">이미지를 불러올 수 없습니다.</div>
      ) : (
        <img src={item.imageUrl} alt="" onError={() => setImageFailed(true)} />
      )}
      <div className="itemCardBody">
        <span className="categoryTag">{item.category}</span>
        <h3>{item.name}</h3>
        <div className="itemMeta">
          <span>Listed Price</span>
          <strong>{item.listedPrice}</strong>
        </div>
        <a href={`#/item/${item.itemId}`}>
          <Button variant="secondary" className="wide">
            Detail →
          </Button>
        </a>
      </div>
    </article>
  );
}
