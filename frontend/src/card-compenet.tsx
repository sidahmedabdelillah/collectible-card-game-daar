import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

export default function CardComponent() {
  return (
    <div className="cards-container"> {/* Use "className" for specifying CSS classes */}
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
      <div className="card">
        <img src="../public/card_unique.jpg" alt="green iguana" />
      </div>
    </div>
  );
}