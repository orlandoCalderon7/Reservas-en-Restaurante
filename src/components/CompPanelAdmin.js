/*CompPanelAdmin.js*/
import React, { useState, useEffect } from 'react';
import './CompPanelAdmin.css';
import { FcStatistics } from "react-icons/fc";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiStopwatch } from "react-icons/ci";
import { ImManWoman } from "react-icons/im";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

function CompPanelAdmin({ onCambiarVista }) {
  const [reservasHoy, setReservasHoy] = useState(0);
  const [mesasDisponibles, setMesasDisponibles] = useState(8);
  const [ocupacion, setOcupacion] = useState(60);
  const [reservasDia, setReservasDia] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const hoy = new Date().toISOString().split('T')[0];
    
    const reservasDeHoy = reservas.filter(r => r.fecha === hoy);
    setReservasHoy(reservasDeHoy.length);
    setReservasDia(reservasDeHoy.slice(0, 5));
    
    const mesasOcupadas = reservasDeHoy.filter(r => r.estado === 'CONFIRMADA').length;
    const totalMesas = 20;
    setMesasDisponibles(totalMesas - mesasOcupadas);
    setOcupacion(Math.round((mesasOcupadas / totalMesas) * 100));
  };

  const handleGestionarReservas = () => {
    if (typeof onCambiarVista === 'function') {
      onCambiarVista('gestionarReservas');
    }
  };

  return (
    <div className="panel-admin-container">
      {/* HEADER */}
      <div className="panel-admin-header">
        <h1 className="panel-titulo">
          <span className="icono-panel"></span>
          PANEL ADMINISTRADOR
        </h1>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="estadisticas-cards">
        <div className="estadistica-card">
          <div className="estadistica-contenido">
            <div className="estadistica-label">RESERVAS HOY</div>
            <div className="estadistica-valor">{reservasHoy}</div>
          </div>
          <div className="estadistica-icono"><FaRegCalendarAlt /></div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-contenido">
            <div className="estadistica-label">MESAS DISPONIBLES</div>
            <div className="estadistica-valor">{mesasDisponibles}</div>
          </div>
          <div className="estadistica-icono"><MdOutlineTableRestaurant /></div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-contenido">
            <div className="estadistica-label">OCUPACIÓN</div>
            <div className="estadistica-valor">{ocupacion}%</div>
          </div>
          <div className="estadistica-icono"><FcStatistics /></div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="panel-contenido">
        {/* CALENDARIO RESERVAS - HORIZONTAL */}
        <div className="panel-section">
          <div className="section-header">
            <span className="section-icono"></span>
            <h2 className="section-titulo">CALENDARIO RESERVAS</h2>
          </div>

          <div className="calendario-contenido">
            {/* CALENDARIO */}
            <div className="calendario-wrapper">
              <div className="calendario-header">
                <div className="calendario-mes">Noviembre 2025</div>
                <div className="calendario-nav">
                  <button className="btn-nav-calendario"><FaLongArrowAltLeft /></button>
                  <button className="btn-nav-calendario"><FaArrowRight /></button>
                </div>
              </div>

              <div className="calendario-grid">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
                  <div key={index} className="calendario-dia-nombre">{dia}</div>
                ))}
                
                {Array.from({ length: 35 }, (_, i) => {
                  if (i < 5 || i > 34) {
                    return <div key={i} className="calendario-dia vacio"></div>;
                  }
                  const dia = i - 4;
                  return (
                    <div 
                      key={i} 
                      className={`calendario-dia ${dia === 27 ? 'hoy' : ''} ${[3, 8, 14].includes(dia) ? 'con-reservas' : ''}`}
                    >
                      {dia}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RESERVAS DEL DÍA SELECCIONADO */}
            <div className="reservas-calendario-wrapper">
              <div className="reservas-calendario-titulo">Reservas - 27 de noviembre</div>
              <div className="reservas-calendario-lista">
                <div className="reserva-calendario-item">
                  <strong>12:00</strong> Mesa 4 - Juan Perez (2 personas)
                </div>
                <div className="reserva-calendario-item">
                  <strong>13:30</strong> Mesa 2 - Maria López (4 personas)
                </div>
                <div className="reserva-calendario-item">
                  <strong>15:00</strong> Mesa 1 - Carlos Diaz (3 personas)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESERVAS DEL DÍA */}
        <div className="panel-section">
          <div className="section-header">
            <span className="section-icono"></span>
            <h2 className="section-titulo">RESERVAS DEL DÍA</h2>
          </div>

          <div className="reservas-dia-lista">
            {reservasDia.length === 0 ? (
              <div className="sin-reservas-mensaje">
                 No hay reservas para hoy
              </div>
            ) : (
              reservasDia.map(reserva => (
                <div key={reserva.id} className="reserva-dia-card">
                  <div className="reserva-dia-header">
                    <div className="reserva-dia-nombre">{reserva.nombre}</div>
                    <div className={`reserva-dia-estado ${reserva.estado.toLowerCase()}`}>
                      {reserva.estado}
                    </div>
                  </div>

                  <div className="reserva-dia-info">
                    <div className="info-badge">
                      <span className="info-badge-icono"><CiStopwatch /></span>
                      {reserva.hora}
                    </div>
                    <div className="info-badge">
                      <span className="info-badge-icono"><ImManWoman /></span>
                      {reserva.personas} PERSONAS
                    </div>
                    <div className="info-badge">
                      <span className="info-badge-icono"><MdOutlineTableRestaurant /></span>
                      MESA No. {reserva.mesa || 'Sin asignar'}
                    </div>
                  </div>

                  <button 
                    className="btn-ver-detalles"
                    onClick={handleGestionarReservas}
                  >
                    VER DETALLES
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompPanelAdmin;

