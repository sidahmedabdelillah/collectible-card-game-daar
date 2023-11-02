import * as React from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'

export default function CardComponent({ images }: { images: string[] }) {
  return (
    <div className="cards-container">
      {images.map((image, index) => (
        <div className="card" key={image}>
          <img src={image}  />
        </div>
      ))}
    </div>
  )
}
