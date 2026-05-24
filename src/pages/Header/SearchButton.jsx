export default function SearchButton({ onSearch }) {
  return (
    <div
      data-id="search-expander"
      onClick={onSearch}
      className="header-controls-pic header-controls-search"
    />
  )
}
