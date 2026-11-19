import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const AlbumDetailPage = ({ albums, onAddToCart }) => {
  const { albumId } = useParams();

  const [qty, setQty] = useState(1);

  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="detail-error">
        <h2>Album Not Found</h2>
        <Link className="btn btn-secondary" to="/">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inStock = album.stock > 0;

  return (
    <div className="detail-container">
      <nav className="breadcrumb">
        <Link to="/">Catalog</Link> &gt; <span>{album.title}</span>
      </nav>

      <div className="detail-grid">
        <img src={album.image} alt={album.title} className="detail-img" />

        <div className="detail-info">
          <span className="album-genre">{album.genre}</span>
          <h1 className="detail-title">{album.title}</h1>
          <p className="detail-artist">{album.artist}</p>
          <p className="detail-price">${album.price.toFixed(2)}</p>
          <p className="detail-desc">{album.description}</p>

          {/* Pressing specifications */}
          <ul className="spec-list">
            <li>
              <span>Catalog #</span>
              <strong>{album.specs.catalogNumber}</strong>
            </li>
            <li>
              <span>Pressing Weight</span>
              <strong>{album.specs.weight}</strong>
            </li>
            <li>
              <span>Speed</span>
              <strong>{album.specs.speed}</strong>
            </li>
            <li>
              <span>Label</span>
              <strong>{album.specs.label}</strong>
            </li>
          </ul>

          <div className={`stock-tag ${inStock ? "in" : "out"}`}>
            {inStock
              ? `✓ In Stock (${album.stock} units available)`
              : "Out of Stock"}
          </div>

          {inStock && (
            <div className="detail-actions">
              <div className="qty-input-group">
                <label htmlFor="detail-qty">Quantity: </label>
                <input
                  type="number"
                  id="detail-qty"
                  min="1"
                  max={album.stock}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onAddToCart(album, qty)}
              >
                Add {qty} to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;
