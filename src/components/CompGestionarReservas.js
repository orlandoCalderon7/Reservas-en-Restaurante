import React, { useState, useEffect } from 'react';
import './CompGestionarReservas.css';
import { LuHouse } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiStopwatch } from "react-icons/ci";
import { ImManWoman } from "react-icons/im";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaPenAlt } from "react-icons/fa";
import { MdMan2 } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { BsLifePreserver } from "react-icons/bs";

function CompGestionarReservas({ onVolver }) {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  
  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '',
    mesa: '',
    estado: ''
  });

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = () => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas') || '[]');
    console.log('Reservas cargadas:', reservasGuardadas);
    setReservas(reservasGuardadas);
    setReservasFiltradas(reservasGuardadas);
  };

  const handleFiltrar = () => {
    if (filtroEstado === '' || filtroEstado === 'Seleccionar') {
      setReservasFiltradas(reservas);
    } else {
      const filtradas = reservas.filter(r => r.estado === filtroEstado);
      setReservasFiltradas(filtradas);
    }
  };

  // ========== FUNCIONES DEL MODAL ==========
  const handleEditar = (reserva) => {
    setReservaEditando(reserva);
    setFormData({
      nombre: reserva.nombre,
      telefono: reserva.telefono,
      fecha: reserva.fecha,
      hora: reserva.hora,
      personas: reserva.personas,
      mesa: reserva.mesa || '',
      estado: reserva.estado
    });
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setReservaEditando(null);
    setFormData({
      nombre: '',
      telefono: '',
      fecha: '',
      hora: '',
      personas: '',
      mesa: '',
      estado: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarCambios = () => {
    if (!reservaEditando) return;

    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.telefono.trim()) {
      alert('El teléfono es obligatorio');
      return;
    }
    if (!formData.fecha) {
      alert('La fecha es obligatoria');
      return;
    }
    if (!formData.hora) {
      alert('La hora es obligatoria');
      return;
    }
    if (!formData.personas || formData.personas < 1) {
      alert('El número de personas debe ser mayor a 0');
      return;
    }

    // Actualizar reserva
    const reservasActualizadas = reservas.map(r => {
      if (r.id === reservaEditando.id) {
        return {
          ...r,
          nombre: formData.nombre,
          telefono: formData.telefono,
          fecha: formData.fecha,
          hora: formData.hora,
          personas: parseInt(formData.personas),
          mesa: formData.mesa,
          estado: formData.estado
        };
      }
      return r;
    });

    // Guardar en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservasActualizadas));

    // Actualizar estados
    setReservas(reservasActualizadas);
    setReservasFiltradas(reservasActualizadas);

    // Cerrar modal
    handleCerrarModal();

    // Mensaje de éxito
    alert('Reserva actualizada correctamente');
  };

  const handleContactar = (reserva) => {
    const mensaje = `
CONTACTAR CLIENTE

Nombre: ${reserva.nombre}
Teléfono: ${reserva.telefono}
Email: ${reserva.email}
Reserva: ${reserva.numeroReserva}
Fecha: ${reserva.fecha}
Hora: ${reserva.hora}
    `.trim();
    
    alert(mensaje);
  };

  return (
    <div className="gestionar-reservas-container">
      {/* HEADER */}
      <div className="gestionar-header">
        <h1 className="gestionar-titulo">
          <span className="gestionar-titulo-icono"><LuHouse /></span>
          GESTIONAR RESERVAS
        </h1>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="gestionar-contenido">
        {/* FILTROS */}
        <div className="filtros-section">
          <h2 className="filtros-titulo">FILTRAR RESERVAS</h2>
          <div className="filtros-form">
            <div className="filtro-group">
              <label className="filtro-label">Filtrar por:</label>
              <select 
                className="filtro-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>
            <button className="btn-filtrar" onClick={handleFiltrar}>
              FILTRAR
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="resultados-section">
          <h2 className="resultados-titulo">RESULTADOS</h2>

          {reservasFiltradas.length === 0 ? (
            <div className="sin-resultados">
              <div className="sin-resultados-icono">📭</div>
              <p>No se encontraron reservas</p>
            </div>
          ) : (
            <div className="reservas-lista">
              {reservasFiltradas.map(reserva => (
                <div key={reserva.id} className="reserva-card">
                  {/* HEADER */}
                  <div className="reserva-header">
                    <div className="reserva-info-group">
                      <div className="reserva-info-item">
                        <span className="reserva-info-label">RESERVA No.</span>
                        <span className="reserva-info-valor">{reserva.numeroReserva}</span>
                      </div>
                      <div className="reserva-info-item">
                        <span className="reserva-info-label">Cliente:</span>
                        <span className="reserva-info-valor">{reserva.nombre}</span>
                      </div>
                      <div className="reserva-info-item">
                        <span className="reserva-info-label">Teléfono:</span>
                        <span className="reserva-info-valor">{reserva.telefono}</span>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="reserva-body">
                    <div className="reserva-detalles">
                      <div className="detalle-badge">
                        <span className="detalle-badge-icono"><CiStopwatch /></span>
                        {reserva.hora}
                      </div>
                      <div className="detalle-badge">
                        <span className="detalle-badge-icono"><ImManWoman /></span>
                        {reserva.personas} PERSONAS
                      </div>
                      {reserva.mesa && (
                        <div className="detalle-badge">
                          <span className="detalle-badge-icono"><MdOutlineTableRestaurant /></span>
                          MESA No. {reserva.mesa}
                        </div>
                      )}
                      <div className={`detalle-badge estado-${reserva.estado.toLowerCase()}`}>
                        {reserva.estado}
                      </div>
                    </div>

                    <div className="reserva-acciones">
                      <button 
                        className="btn-accion btn-editar"
                        onClick={() => handleEditar(reserva)}
                      >
                        EDITAR
                      </button>
                      <button 
                        className="btn-accion btn-contactar"
                        onClick={() => handleContactar(reserva)}
                      >
                        CONTACTAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========== MODAL EDITAR ========== */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="modal-header">
              <h2 className="modal-titulo">
                <span className="modal-titulo-icono"><FaPenAlt /></span>
                EDITAR RESERVA
              </h2>
              <button className="btn-cerrar-modal" onClick={handleCerrarModal}>
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* INFO RESERVA */}
              <div className="modal-info-reserva">
                <p><strong>Reserva No.:</strong> {reservaEditando?.numeroReserva}</p>
                <p><strong>Email:</strong> {reservaEditando?.email}</p>
                <p className="form-nota"> </p>
              </div>

              {/* FORMULARIO */}
              <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                {/* NOMBRE */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icono"><MdMan2 /></span>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-input"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {/* TELÉFONO */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icono"><MdLocalPhone /></span>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-input"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 983 511 554"
                  />
                </div>

                {/* FECHA Y HORA */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><FaRegCalendarAlt /></span>
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-input"
                      value={formData.fecha}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><CiStopwatch /></span>
                      Hora
                    </label>
                    <input
                      type="time"
                      name="hora"
                      className="form-input"
                      value={formData.hora}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* PERSONAS Y MESA */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><ImManWoman /></span>
                      Número de Personas
                    </label>
                    <input
                      type="number"
                      name="personas"
                      className="form-input"
                      value={formData.personas}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><MdOutlineTableRestaurant /></span>
                      Mesa No.
                    </label>
                    <input
                      type="text"
                      name="mesa"
                      className="form-input"
                      value={formData.mesa}
                      onChange={handleInputChange}
                      placeholder="Ej: 05"
                    />
                  </div>
                </div>

                {/* ESTADO */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icono"><BsLifePreserver /></span>
                    Estado de la Reserva
                  </label>
                  <select
                    name="estado"
                    className="form-select"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADA">CONFIRMADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </div>
              </form>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn-modal btn-cancelar" onClick={handleCerrarModal}>
                CANCELAR
              </button>
              <button className="btn-modal btn-guardar" onClick={handleGuardarCambios}>
                GUARDAR CAMBIOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompGestionarReservas;
