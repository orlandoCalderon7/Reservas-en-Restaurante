import React from 'react';
import { IoLogOutOutline } from 'react-icons/io5'; //  Importar el ícono
import './CompNav.css';

function CompNav({ usuario, tipoUsuario, onLogout, vistaActual, cambiarVista }) {
  const handleNavClick = (vista) => {
    console.log('Navegando a:', vista);
    if (typeof cambiarVista === 'function') {
      cambiarVista(vista);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-botones">
        {/* BOTÓN INICIO */}
        <button 
          className={`nav-btn ${vistaActual === 'inicio' ? 'activo' : ''}`}
          onClick={() => handleNavClick('inicio')}
        >
          INICIO
        </button>

        {/* BOTONES PARA CLIENTE */}
        {tipoUsuario === 'cliente' && (
          <>
            <button 
              className={`nav-btn ${vistaActual === 'carta' ? 'activo' : ''}`}
              onClick={() => handleNavClick('carta')}
            >
              PANEL CLIENTE
            </button>
            <button 
              className={`nav-btn ${vistaActual === 'reserva' ? 'activo' : ''}`}
              onClick={() => handleNavClick('reserva')}
            >
              RESERVA
            </button>
            <button 
              className={`nav-btn ${vistaActual === 'confirmacion' ? 'activo' : ''}`}
              onClick={() => handleNavClick('confirmacion')}
            >
              CONFIRMACIÓN
            </button>
          </>
        )}

        {/* BOTONES PARA ADMINISTRADOR */}
        {tipoUsuario === 'admin' && (
          <>
            <button 
              className={`nav-btn ${vistaActual === 'panelAdmin' ? 'activo' : ''}`}
              onClick={() => handleNavClick('panelAdmin')}
            >
              PANEL ADMIN
            </button>
            <button 
              className={`nav-btn ${vistaActual === 'gestionarReservas' ? 'activo' : ''}`}
              onClick={() => handleNavClick('gestionarReservas')}
            >
              GESTIONAR RESERVAS
            </button>
          </>
        )}

        {/* BOTONES DESHABILITADOS */}
        <button className="nav-btn nav-btn-disabled" disabled>
          LOGIN CLIENTE
        </button>
        <button className="nav-btn nav-btn-disabled" disabled>
          LOGIN ADMIN
        </button>
      </div>

      {/* SECCIÓN DE USUARIO */}
      <div className="nav-usuario">
        <div className="usuario-info">
          <span className="usuario-icono">
            {tipoUsuario === 'admin' ? '👨‍💼' : '👤'}
          </span>
          <span className="usuario-nombre">{usuario}</span>
          <span className="usuario-tipo">
            ({tipoUsuario === 'admin' ? 'Administrador' : 'Cliente'})
          </span>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <IoLogOutOutline size={20} /> {/* ← Ícono agregado */}
          
        </button>
      </div>
    </nav>
  );
}

export default CompNav;
