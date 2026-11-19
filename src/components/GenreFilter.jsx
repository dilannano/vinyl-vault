import React from "react";

// Controlled button group. The parent (CatalogPage) owns `selectedGenre`;
// this component just renders the options and reports clicks back up.
const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="filter-bar">
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          className={`filter-pill ${selectedGenre === genre ? "active" : ""}`}
          onClick={() => onSelectGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
