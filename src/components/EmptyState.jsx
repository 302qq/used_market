export default function EmptyState({ title, description, action }) {
  return (
    <section className="emptyState">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </section>
  );
}
