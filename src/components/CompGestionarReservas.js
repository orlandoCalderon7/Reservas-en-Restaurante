/*CompGestionarReservas.js*/
import React, { useState, useEffect } from 'react';
import './CompGestionarReservas.css';
import { LuHouse } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiStopwatch } from "react-icons/ci";
import { ImManWoman } from "react-icons/im";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaPenAlt, FaIdCard, FaLock } from "react-icons/fa";
import { MdMan2, MdLocalPhone } from "react-icons/md";
import { BsLifePreserver } from "react-icons/bs";

function CompGestionarReservas({ onVolver }) {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDNI, setFiltroDNI] = useState(''); 
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  
  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '',
    mesa: '',
    estado: ''
  });

  //  ESTADO PARA GUARDAR DNI Y NOMBRE ORIGINALES
  const [datosOriginales, setDatosOriginales] = useState({
    dni: '',
    nombre: ''
  });

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = () => {
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas') || '[]');
    console.log(' Reservas cargadas:', reservasGuardadas);
    setReservas(reservasGuardadas);
    setReservasFiltradas(reservasGuardadas);
  };

  // VALIDACIÓN DE DNI
  const validarDNI = (dni) => {
    const dniRegex = /^[0-9]{8}$/;
    return dniRegex.test(dni);
  };

  // FUNCIÓN DE FILTRADO MEJORADA
  const handleFiltrar = () => {
    let filtradas = [...reservas];

    // Filtrar por estado
    if (filtroEstado && filtroEstado !== 'Seleccionar') {
      filtradas = filtradas.filter(r => r.estado === filtroEstado);
    }

    // Filtrar por DNI
    if (filtroDNI.trim()) {
      filtradas = filtradas.filter(r => 
        r.dni && r.dni.includes(filtroDNI.trim())
      );
    }

    setReservasFiltradas(filtradas);

    // Mensaje si no hay resultados
    if (filtradas.length === 0) {
      console.log(' No se encontraron reservas con los filtros aplicados');
    }
  };

  // LIMPIAR FILTROS
  const handleLimpiarFiltros = () => {
    setFiltroEstado('');
    setFiltroDNI('');
    setReservasFiltradas(reservas);
  };

  // ========== FUNCIONES DEL MODAL ==========
  const handleEditar = (reserva) => {
    console.log(' Editando reserva:', reserva);
    
    setReservaEditando(reserva);
    
    // GUARDAR DATOS ORIGINALES
    setDatosOriginales({
      dni: reserva.dni || '',
      nombre: reserva.nombre || ''
    });

    setFormData({
      dni: reserva.dni || '',
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
    setDatosOriginales({ dni: '', nombre: '' });
    setFormData({
      dni: '',
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
    
    //  BLOQUEAR EDICIÓN DE DNI Y NOMBRE
    if (reservaEditando && (name === 'dni' || name === 'nombre')) {
      console.warn(' Campo bloqueado:', name);
      alert(` El ${name === 'dni' ? 'DNI' : 'nombre'} no se puede modificar por seguridad`);
      return;
    }

    // VALIDACIÓN ESPECIAL PARA DNI (solo números, máximo 8)
    if (name === 'dni') {
      const soloNumeros = value.replace(/[^0-9]/g, '').slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarCambios = () => {
    if (!reservaEditando) return;

    //  FORZAR DNI Y NOMBRE ORIGINALES
    const dniOriginal = datosOriginales.dni;
    const nombreOriginal = datosOriginales.nombre;

    console.log(' Guardando con datos originales:');
    console.log('- DNI original:', dniOriginal);
    console.log('- Nombre original:', nombreOriginal);

    // VALIDACIÓN DNI (usar el original)
    if (!dniOriginal.trim()) {
      alert('El DNI es obligatorio');
      return;
    }
    if (!validarDNI(dniOriginal)) {
      alert(' El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    // Validaciones existentes
    if (!nombreOriginal.trim()) {
      alert(' El nombre es obligatorio');
      return;
    }
    if (!formData.telefono.trim()) {
      alert(' El teléfono es obligatorio');
      return;
    }
    if (!formData.fecha) {
      alert(' La fecha es obligatoria');
      return;
    }
    if (!formData.hora) {
      alert('La hora es obligatoria');
      return;
    }
    if (!formData.personas || formData.personas < 1) {
      alert(' El número de personas debe ser mayor a 0');
      return;
    }

    // Actualizar reserva
    const reservasActualizadas = reservas.map(r => {
      if (r.id === reservaEditando.id) {
        return {
          ...r,
          dni: dniOriginal,           
          nombre: nombreOriginal,     
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
    alert(' Reserva actualizada correctamente');
    console.log(' Reserva guardada:', reservasActualizadas.find(r => r.id === reservaEditando.id));
  };

  const handleContactar = (reserva) => {
    const mensaje = `
CONTACTAR CLIENTE

DNI: ${reserva.dni || 'No registrado'}
Nombre: ${reserva.nombre}
Teléfono: ${reserva.telefono}
Email: ${reserva.email || 'No registrado'}
Reserva: ${reserva.numeroReserva}
Fecha: ${reserva.fecha}
Hora: ${reserva.hora}
Personas: ${reserva.personas}
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
          <h2 className="filtros-titulo">🔍 FILTRAR RESERVAS</h2>
          <div className="filtros-form">
            {/* FILTRO POR DNI */}
            <div className="filtro-group">
              <label className="filtro-label">
                <FaIdCard /> DNI:
              </label>
              <input
                type="text"
                className="filtro-input"
                placeholder="Buscar por DNI"
                value={filtroDNI}
                onChange={(e) => setFiltroDNI(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                maxLength="8"
              />
            </div>

            {/* FILTRO POR ESTADO */}
            <div className="filtro-group">
              <label className="filtro-label">Estado:</label>
              <select 
                className="filtro-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>

            {/* BOTONES */}
            <button className="btn-filtrar" onClick={handleFiltrar}>
              FILTRAR
            </button>
            <button className="btn-limpiar" onClick={handleLimpiarFiltros}>
              LIMPIAR
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="resultados-section">
          <h2 className="resultados-titulo">
            RESULTADOS ({reservasFiltradas.length})
          </h2>

          {reservasFiltradas.length === 0 ? (
            <div className="sin-resultados">
              <div className="sin-resultados-icono">📭</div>
              <p>No se encontraron reservas</p>
              {(filtroEstado || filtroDNI) && (
                <button className="btn-ver-todas" onClick={handleLimpiarFiltros}>
                  Ver todas las reservas
                </button>
              )}
            </div>
          ) : (
            <div className="reservas-lista">
              {reservasFiltradas.map(reserva => (
                <div key={reserva.id} className="reserva-card">
                  {/* HEADER */}
                  <div className="reserva-header">
                    <div className="reserva-info-group">
                      {/* DNI VISIBLE */}
                      <div className="reserva-info-item reserva-dni">
                        <span className="reserva-info-label">
                          <FaIdCard /> DNI:
                        </span>
                        <span className="reserva-info-valor reserva-dni-valor">
                          {reserva.dni || 'No registrado'}
                        </span>
                      </div>
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
                        <span className="detalle-badge-icono"><FaRegCalendarAlt /></span>
                        {reserva.fecha}
                      </div>
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
                        📞 CONTACTAR
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

            {/* BANNER DE ADVERTENCIA */}
            <div className="modal-advertencia">
              <FaLock /> 
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* INFO RESERVA */}
              <div className="modal-info-reserva">
                <p><strong>Reserva No.:</strong> {reservaEditando?.numeroReserva}</p>
                <p><strong>Email:</strong> {reservaEditando?.email || 'No registrado'}</p>
              </div>

              {/* FORMULARIO */}
              <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                {/*  DNI  */}
                <div className="form-group form-group-destacado form-group-">
                  <label className="form-label">
                    <span className="form-label-icono"><FaIdCard /></span>
                    DNI *
                    <span className="badge-modal">
                      <FaLock /> 
                    </span>
                  </label>
                  <input
                    type="text"
                    name="dni"
                    className="form-input form-input-dni input-modal"
                    value={datosOriginales.dni}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    placeholder="Ingrese 8 dígitos"
                    maxLength="8"
                    disabled
                    readOnly
                    required
                  />
                  <small className="form-ayuda form-ayuda">
                    
                  </small>
                </div>

                {/*  NOMBRE */}
                <div className="form-group form-group-bloqueado">
                  <label className="form-label">
                    <span className="form-label-icono"><MdMan2 /></span>
                    Nombre Completo *
                    <span className="badge-bloqueado-modal">
                      <FaLock /> 
                    </span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-input input-bloqueado-modal"
                    value={datosOriginales.nombre}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    placeholder="Ejemplo: Juan Pérez"
                    disabled
                    readOnly
                    required
                  />
                  <small className="form-ayuda form-ayuda-bloqueado">
                    
                  </small>
                </div>

                {/* TELÉFONO */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icono"><MdLocalPhone /></span>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-input"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ejemplo: 983 511 554"
                    required
                  />
                </div>

                {/* FECHA Y HORA */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><FaRegCalendarAlt /></span>
                      Fecha *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-input"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><CiStopwatch /></span>
                      Hora *
                    </label>
                    <input
                      type="time"
                      name="hora"
                      className="form-input"
                      value={formData.hora}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* PERSONAS Y MESA */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="form-label-icono"><ImManWoman /></span>
                      Número de Personas *
                    </label>
                    <input
                      type="number"
                      name="personas"
                      className="form-input"
                      value={formData.personas}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
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
                      placeholder="Ejemplo: 05"
                    />
                  </div>
                </div>

                {/* ESTADO */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-icono"><BsLifePreserver /></span>
                    Estado de la Reserva *
                  </label>
                  <select
                    name="estado"
                    className="form-select"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
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
