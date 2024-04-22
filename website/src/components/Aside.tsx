export default function Aside({ type = "note", title = "", children }) {
  return (
    <div className={`starlight-aside starlight-aside--${type}`}>
      <p className="starlight-aside__title">{title}</p>
      <section className="starlight-aside__content">{children}</section>
    </div>
  )
}
