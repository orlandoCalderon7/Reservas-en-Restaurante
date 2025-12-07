import React from 'react';
import cartaA from '../assets/cartas/a.jpg';
import cartaB from '../assets/cartas/b.jpg';
import cartaC from '../assets/cartas/c.jpg';
import './CompCarta.css';



function CompCarta({ onReservar }) {
  const cartas = [
    {
      id: 1,
      titulo: "CARTA DE COMIDAS",
      descripcion: "Selección de platos frescos y contundentes, ideales para compartir o disfrutar individualmente.",
      imagen: cartaA,
      pdf: "/cartas/carta-comidas.pdf" 
      
    },
    {
      id: 2,
      titulo: "CARTA DE BEBIDAS Y CÓCTELES",
      descripcion: "Bebidas refrescantes, cócteles clásicos y de autor elaborados con ingredientes de calidad.",
      imagen: cartaB,
      pdf: "/cartas/carta-bebidas.pdf"
      
    },
    {
      id: 3,
      titulo: "CARTA DE PROMOCIONES Y COMBOS",
      descripcion: "Ofertas especiales, combos y descuentos por tiempo limitado. Perfecto para aprovechar más por menos.",
      imagen: cartaC,
      pdf: "/cartas/carta-promos.pdf"
      
    }
  ];

  return (
    <div className="carta-container">
      <h1 className="carta-titulo">
        ECHA UN VISTAZO A NUESTRAS CARTAS Y HAZ TU RESERVA
      </h1>
      
      <div className="cartas-lista">
        {cartas.map((carta) => (
          <div key={carta.id} className="carta-item">
            <div className="carta-imagen">
              <img src={carta.imagen} alt={carta.titulo} />
              <span className="carta-emoji">{carta.emoji}</span>
            </div>
            
            <div className="carta-contenido">
              <h2>{carta.titulo}</h2>
              <p>{carta.descripcion}</p>
              
              <div className="carta-botones">
                <button 
                  className="btn-ver-carta"
                  onClick={() => window.open(carta.pdf, "_blank")}
                >
                  VER CARTA
                </button>
                <button 
                  className="btn-ir-reservar"
                  onClick={onReservar}
                >
                  IR A RESERVAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompCarta;