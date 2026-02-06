/*App.js*/
import React, { useState, useEffect } from 'react';
import CompNav from './components/CompNav';
import CompLogin from './components/CompLogin';
import CompRegistro from './components/CompRegistro';
import CompRecuperarPass from './components/CompRecuperarPass';
import CompActualizarPass from './components/CompActualizarPass';
import CompCarta from './components/CompCarta';
import CompFormReserva from './components/CompFormReserva';
import CompConfirmacion from './components/CompConfirmacion';
import CompPanelAdmin from './components/CompPanelAdmin';
import CompGestionarReservas from './components/CompGestionarReservas';
import CompFooter from './components/CompFooter';
import CompTema from './components/CompTema';
import logoRestaurante from "./assets/logo/logo-restaurante.png";
import './App.css';


function App() {
  const [vista, setVista] = useState('inicio');
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [reservaActual, setReservaActual] = useState(null);
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');

  // 1. ESTADO DEL TEMA
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'claro');

  // 2. FUNCIÓN PARA ALTERNAR EL TEMA
  const toggleTema = () => {
    setTema(prevTema => (prevTema === 'claro' ? 'oscuro' : 'claro'));
  };

  // 3. EFECTO PARA GUARDAR EL TEMA EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('tema', tema);
  }, [tema]);

  // useEffect para monitorear cambios de vista
  useEffect(() => {
    console.log('Vista actual:', vista);
    console.log('Usuario:', usuario);
    console.log('Tipo de usuario:', tipoUsuario);
  }, [vista, usuario, tipoUsuario]);

  // ========== FUNCIONES DE AUTENTICACIÓN ==========
  const handleLogin = (emailOrUsername, tipo) => {
    console.log('Intentando login:', emailOrUsername, tipo);
    
    if (tipo === 'cliente') {
      // Validar login de cliente
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioEncontrado = usuarios.find(u => u.correo === emailOrUsername);
      
      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado.nombre);
        setTipoUsuario(tipo);
        setVista('carta');
        console.log('Login exitoso como cliente');
      } else {
        alert(' Usuario no encontrado. Por favor regístrate.');
      }
    } else if (tipo === 'admin') {
      // Login de administrador
      setUsuario('Orlando Agip');
      setTipoUsuario(tipo);
      setVista('panelAdmin');
      console.log('Login exitoso como admin');
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setUsuario(null);
    setTipoUsuario(null);
    setVista('inicio');
    setReservaActual(null);
  };

  // ========== FUNCIONES DE RESERVAS ==========
  const handleConfirmarReserva = (datos) => {
    console.log('=== CONFIRMAR RESERVA ===');
    console.log('Datos recibidos:', datos);
    
    try {
      // Generar número de reserva único
      const numeroReserva = `R${Date.now().toString().slice(-6)}-2025`;
      const mesa = Math.floor(Math.random() * 20) + 1;
      
      const reservaCompleta = {
        ...datos,
        id: Date.now(),
        numeroReserva,
        mesa,
        estado: datos.estado || 'CONFIRMADA',
        fechaCreacion: new Date().toISOString(),
        cliente: usuario || 'Invitado'
      };

      console.log('Reserva completa generada:', reservaCompleta);

      // Guardar en localStorage
      const reservasExistentes = JSON.parse(localStorage.getItem('reservas') || '[]');
      reservasExistentes.push(reservaCompleta);
      localStorage.setItem('reservas', JSON.stringify(reservasExistentes));
      console.log('Reserva guardada en localStorage');
      console.log('Total de reservas:', reservasExistentes.length);

      setReservaActual(reservaCompleta);
      setVista('confirmacion');
      console.log('Navegando a vista de confirmación');
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      alert(' Error al procesar la reserva. Por favor intenta nuevamente.');
    }
  };

  const handleSepararMesa = (datos) => {
    console.log('=== SEPARAR MESA ===');
    console.log('Datos recibidos:', datos);
    
    try {
      // Generar número de reserva único
      const numeroReserva = `R${Date.now().toString().slice(-6)}-2025`;
      
      const reservaCompleta = {
        ...datos,
        id: Date.now(),
        numeroReserva,
        mesa: null, // Mesa sin asignar
        estado: 'PENDIENTE',
        fechaCreacion: new Date().toISOString(),
        cliente: usuario || 'Invitado'
      };

      console.log('Reserva pendiente generada:', reservaCompleta);

      // Guardar en localStorage
      const reservasExistentes = JSON.parse(localStorage.getItem('reservas') || '[]');
      reservasExistentes.push(reservaCompleta);
      localStorage.setItem('reservas', JSON.stringify(reservasExistentes));
      console.log('Reserva pendiente guardada en localStorage');
      console.log('Total de reservas:', reservasExistentes.length);

      setReservaActual(reservaCompleta);
      setVista('confirmacion');
      console.log('Navegando a vista de confirmación');
    } catch (error) {
      console.error('Error al separar mesa:', error);
      alert(' Error al procesar la reserva. Por favor intenta nuevamente.');
    }
  };

  // ========== FUNCIONES DE REGISTRO Y RECUPERACIÓN ==========
  const handleRegistroExitoso = () => {
    console.log('Registro exitoso, redirigiendo a login...');
    setVista('loginCliente');
  };

  const handleEnviarCodigo = (correo) => {
    console.log('Código enviado a:', correo);
    setCorreoRecuperacion(correo);
    setVista('actualizarPassword');
  };

  const handleActualizacionExitosa = () => {
    console.log('Contraseña actualizada, redirigiendo a login...');
    setVista('loginCliente');
  };

  // ========== FUNCIÓN PARA RENDERIZAR NAVBAR ==========
  const renderNavbar = () => {
    // Determinar qué botones mostrar según la vista
    const navConfig = {
      inicio: {
        botones: [
          { nombre: 'INICIO', activo: true, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: false, accion: () => setVista('loginCliente') },
          { nombre: 'LOGIN ADMIN', activo: false, accion: () => setVista('loginAdmin') },
          { nombre: 'PANEL ADMIN', activo: false, disabled: true },
          { nombre: 'PANEL CLIENTE', activo: false, disabled: true },
          { nombre: 'CONFIRMACIÓN', activo: false, disabled: true }
        ]
      },
      loginCliente: {
        botones: [
          { nombre: 'INICIO', activo: false, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: true, accion: () => setVista('loginCliente') },
          { nombre: 'LOGIN ADMIN', activo: false, accion: () => setVista('loginAdmin') },          
        ]
      },
      loginAdmin: {
        botones: [
          { nombre: 'INICIO', activo: false, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: false, accion: () => setVista('loginCliente') },
          { nombre: 'LOGIN ADMIN', activo: true, accion: () => setVista('loginAdmin') },          
        ]
      },
      registro: {
        botones: [
          { nombre: 'INICIO', activo: false, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: false, accion: () => setVista('loginCliente') },
          { nombre: 'LOGIN ADMIN', activo: false, accion: () => setVista('loginAdmin') },          
        ]
      },
      recuperarPassword: {
        botones: [
          { nombre: 'INICIO', activo: false, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: false, accion: () => setVista('loginCliente') },          
        ]
      },
      actualizarPassword: {
        botones: [
          { nombre: 'INICIO', activo: false, accion: () => setVista('inicio') },
          { nombre: 'LOGIN CLIENTE', activo: false, accion: () => setVista('loginCliente') },
          { nombre: 'LOGIN ADMIN', activo: false, accion: () => setVista('loginAdmin') },          
        ]
      }
    };

    // Si hay usuario logueado, usar CompNav normal
    if (usuario && tipoUsuario) {
      return (
        <CompNav 
          usuario={usuario} 
          tipoUsuario={tipoUsuario} 
          onLogout={handleLogout}
          vistaActual={vista}
          cambiarVista={setVista}
          tema={tema}
          toggleTema={toggleTema}
        />
      );
    }

    // Si no hay usuario, mostrar navbar personalizado según la vista
    const config = navConfig[vista] || navConfig.inicio;

    return (
      <nav className="navbar">
        <div className="nav-botones">
          {config.botones.map((boton, index) => (
            <button
              key={index}
              className={`nav-btn ${boton.activo ? 'activo' : ''} ${boton.disabled ? 'nav-btn-disabled' : ''}`}
              onClick={boton.accion}
              disabled={boton.disabled}
            >
              {boton.nombre}
            </button>
          ))}
        </div>
        
        <div className="nav-usuario">
          <CompTema tema={tema} toggleTema={toggleTema} /> 
          <div className="logo-nav">
            <span style={{ fontSize: '2rem' }}>
              <img 
                src={logoRestaurante} 
                alt="Logo Los Tres Sabores" 
                className="logo-inicio"
              />
            </span>
          </div>
        </div>
      </nav>
    );
  };

  // ========== RENDERIZADO PRINCIPAL ==========
  return (
    <div className={`app-container ${tema === 'oscuro' ? 'dark' : ''}`}> 
      
      {/* NAVBAR EN TODAS LAS VISTAS */}
      {renderNavbar()}
      

      {/* CONTENIDO SEGÚN LA VISTA */}
      {vista === 'inicio' && (
        <div className="inicio-wrapper">
          <div className="header-inicio">
            <div className="logo-inicio-container">
              <img 
                src={logoRestaurante} 
                alt="Logo Los Tres Sabores" 
                className="logo-inicio"
              />
            </div>
            <h1 className="titulo-principal">LOS TRES SABORES</h1>
            <p className="subtitulo">Sistema de gestión de Reservas</p>
          </div>
          
          <div className="contenedor-accesos">
            <div className="tarjeta-acceso">
              <div className="icono-usuario">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2>ACCESO CLIENTE</h2>
              <div className="linea-separadora"></div>
              <p>Reserva tu mesa de forma rápida y sencilla</p>
              <button 
                className="btn-ingresar"
                onClick={() => setVista('loginCliente')}
              >
                INGRESAR
              </button>
            </div>

            <div className="tarjeta-acceso">
              <div className="icono-usuario">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2>ACCESO ADMINISTRADOR</h2>
              <div className="linea-separadora"></div>
              <p>Gestionar reservas y configurar sistema</p>
              <button 
                className="btn-ingresar"
                onClick={() => setVista('loginAdmin')}
              >
                INGRESAR
              </button>
            </div>
          </div>
          
          <CompFooter />
        </div>
      )}

      {vista === 'loginCliente' && (
        <CompLogin 
          tipo="cliente" 
          onLogin={handleLogin}
          onRegistro={() => setVista('registro')}
          onRecuperar={() => setVista('recuperarPassword')}
        />
      )}

      {vista === 'loginAdmin' && (
        <CompLogin tipo="admin" onLogin={handleLogin} />
      )}

      {vista === 'registro' && (
        <CompRegistro 
          onVolver={() => setVista('loginCliente')}
          onRegistroExitoso={handleRegistroExitoso}
        />
      )}

      {vista === 'recuperarPassword' && (
        <CompRecuperarPass 
          onVolver={() => setVista('loginCliente')}
          onEnviarCodigo={handleEnviarCodigo}
        />
      )}

      {vista === 'actualizarPassword' && (
        <CompActualizarPass 
          correo={correoRecuperacion}
          onVolver={() => setVista('loginCliente')}
          onActualizacionExitosa={handleActualizacionExitosa}
        />
      )}

      {vista === 'carta' && (
        <>
          <CompCarta onReservar={() => setVista('reserva')} />
          <CompFooter />
        </>
      )}

      {vista === 'reserva' && (
        <>
          <CompFormReserva 
            onConfirmar={handleConfirmarReserva}
            onCancelar={() => {
              console.log('Cancelando y volviendo a carta...');
              setVista('carta');
            }}
            onSepararMesa={handleSepararMesa}
          />
          <CompFooter />
        </>
      )}

      {vista === 'confirmacion' && (
        <>
          <CompConfirmacion 
            reserva={reservaActual} 
            onVolver={() => {
              console.log('Volviendo a carta desde confirmación...');
              setVista('carta');
            }} 
          />
          <CompFooter />
        </>
      )}

      {vista === 'panelAdmin' && (
        <>
          <CompPanelAdmin 
            onCambiarVista={(nuevaVista) => {
              console.log('Cambiando vista desde panel admin a:', nuevaVista);
              setVista(nuevaVista);
            }} 
          />
          <CompFooter />
        </>
      )}


      {vista === 'gestionarReservas' && (
        <>
          <CompGestionarReservas 
            onVolver={() => {
              console.log('Volviendo a panel admin...');
              setVista('panelAdmin');
            }} 
          />
          <CompFooter />
        </>
      )}

    </div>
  );
}

export default App;
