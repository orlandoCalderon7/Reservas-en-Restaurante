import React from 'react';

function CompConfirmacion({ reserva, onVolver }) {
  if (!reserva) {
    return (
      <div className="confirmacion-container">
        <div className="confirmacion-card">
          <p>No hay información de reserva disponible.</p>
          <button className="btn-volver" onClick={onVolver}>
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    );
  }

  const esPendiente = reserva.estado === 'PENDIENTE';

  return (
    <div className="confirmacion-container">
      <div className="confirmacion-card">
        <div className="confirmacion-header">
          <div className="icono-check">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={esPendiente ? "#f59e0b" : "#10b981"} strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="titulo-confirmacion">
            {esPendiente ? 'RESERVA PENDIENTE' : 'RESERVA CONFIRMADA'}
          </h1>
        </div>

        <p className="mensaje-exito">
          {esPendiente 
            ? 'Tu solicitud de reserva ha sido recibida. El restaurante confirmará tu mesa pronto.'
            : 'Tu reserva ha sido confirmada exitosamente. ¡Te esperamos!'}
        </p>

        <div className="detalles-reserva">
          <h3>DETALLES DE TU RESERVA</h3>
          
          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span><strong>Número de Reserva:</strong> {reserva.numeroReserva}</span>
          </div>

          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span><strong>Nombre:</strong> {reserva.nombre}</span>
          </div>

          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>

          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span><strong>Hora:</strong> {reserva.hora}</span>
          </div>

          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span><strong>Personas:</strong> {reserva.personas}</span>
          </div>

          {reserva.mesa && (
            <div className="detalle-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span><strong>Mesa:</strong> {reserva.mesa}</span>
            </div>
          )}

          <div className="detalle-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={esPendiente ? "#f59e0b" : "#10b981"} strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>
              <strong>Estado:</strong> 
              <span style={{ 
                color: esPendiente ? '#f59e0b' : '#10b981',
                fontWeight: 'bold',
                marginLeft: '8px'
              }}>
                {reserva.estado}
              </span>
            </span>
          </div>

          {reserva.solicitudes && (
            <div className="detalle-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span><strong>Solicitudes:</strong> {reserva.solicitudes}</span>
            </div>
          )}
        </div>

        <div className="mensaje-correo">
          <p>
            {esPendiente 
              ? 'Recibirás un correo de confirmación cuando el restaurante apruebe tu reserva'
              : 'Se ha enviado un correo de confirmación a: ' + reserva.email}
          </p>
        </div>

        <button className="btn-volver" onClick={onVolver}>
          VOLVER AL PANEL
        </button>
      </div>
    </div>
  );
}

export default CompConfirmacion;
