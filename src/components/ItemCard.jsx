import Button from "./Button.jsx";

export default function ItemCard({ item }) {
  return (
    <article className="itemCard">
      <img src={item.imageUrl} alt="" />
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
