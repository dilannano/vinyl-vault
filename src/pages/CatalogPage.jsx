import React, { useState } from "react";
import GenreFilter from "../components/GenreFilter";
import AlbumCard from "../components/AlbumCard";

// Home route "/" — storefront with genre filtering and the album grid.
function CatalogPage({ albums, onAddToCart }) {
  const genres = ["All", "Jazz", "Electronic", "Rock", "Classical"];

  // Local state: which genre is currently selected (default "All").
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Safety check in case the dataset is missing.
  const validAlbums = albums || [];

  // Derive the visible list from state (never mutate the source array).
  const filteredAlbums =
    selectedGenre === "All"
      ? validAlbums
      : validAlbums.filter((album) => album.genre === selectedGenre);

  return (
    <div className="catalog-container">
      <header className="catalog-hero">
        <h1>VinylVault — Indie Record Store</h1>
        <p>Hand-picked pressings for the modern collector.</p>
      </header>

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />

      <div className="album-grid">
        {filteredAlbums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default CatalogPage;
