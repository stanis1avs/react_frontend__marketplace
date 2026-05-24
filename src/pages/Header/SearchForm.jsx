export default function SearchForm({ formRef, inputRef, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      data-id="search-form"
      ref={formRef}
      className="header-controls-search-form form-inline invisible"
      onSubmit={handleSubmit}
    >
      <input className="form-control" placeholder="Поиск" ref={inputRef} />
    </form>
  )
}
