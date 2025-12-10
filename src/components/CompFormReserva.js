import React, { useState } from 'react';
import './CompFormReserva.css';
import { BsStopwatch } from "react-icons/bs";


function CompFormReserva({ onConfirmar, onCancelar, onSepararMesa }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    personas: '',
    solicitudes: '',
    disponibilidadConfirmada: false
  });

  const [errors, setErrors] = useState({});
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);
  const [disponibilidadVerificada, setDisponibilidadVerificada] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'fecha' || name === 'hora') {
      setDisponibilidadVerificada(false);
      setFormData(prev => ({
        ...prev,
        disponibilidadConfirmada: false
      }));
    }
  };

  const validarHorario = (hora) => {
    if (!hora) return false;
    const [horas, minutos] = hora.split(':').map(Number);
    const horaEnMinutos = horas * 60 + minutos;
    const horaInicio = 9 * 60;
    const horaFin = 22 * 60;
    return horaEnMinutos >= horaInicio && horaEnMinutos <= horaFin;
  };

  const verificarDisponibilidad = () => {
    if (!formData.fecha) {
      alert('Por favor, selecciona una fecha primero');
      return;
    }

    if (!formData.hora) {
      alert('Por favor, selecciona una hora primero');
      return;
    }

    if (!validarHorario(formData.hora)) {
      alert('El horario debe estar entre 9:00 AM y 10:00 PM');
      return;
    }

    const fechaSeleccionada = new Date(formData.fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      alert('No puedes reservar en una fecha pasada');
      return;
    }

    setVerificandoDisponibilidad(true);

    setTimeout(() => {
      const reservasExistentes = JSON.parse(localStorage.getItem('reservas') || '[]');
      const reservaExistente = reservasExistentes.find(r => 
        r.fecha === formData.fecha && 
        r.hora === formData.hora &&
        r.estado !== 'CANCELADA'
      );

      setVerificandoDisponibilidad(false);

      if (reservaExistente) {
        alert(`Lo sentimos, ya existe una reserva para el ${formData.fecha} a las ${formData.hora}.\n\nPor favor, selecciona otro horario.`);
        setDisponibilidadVerificada(false);
        setFormData(prev => ({
          ...prev,
          disponibilidadConfirmada: false
        }));
      } else {
        alert(`¡Disponibilidad confirmada!\n\nFecha: ${formData.fecha}\nHora: ${formData.hora}\n\nPuedes continuar con tu reserva.`);
        setDisponibilidadVerificada(true);
        setFormData(prev => ({
          ...prev,
          disponibilidadConfirmada: true
        }));
      }
    }, 1500);
  };

  // ========== VALIDACIÓN BÁSICA (SIN DISPONIBILIDAD) ==========
  const validarFormularioBasico = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    const telefonoRegex = /^[0-9]{9,15}$/;
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'Teléfono inválido (9-15 dígitos)';
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria';
    } else {
      const fechaSeleccionada = new Date(formData.fecha + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.hora) {
      nuevosErrores.hora = 'La hora es obligatoria';
    } else if (!validarHorario(formData.hora)) {
      nuevosErrores.hora = 'Horario permitido: 9:00 AM - 10:00 PM';
    }

    if (!formData.personas || formData.personas < 1 || formData.personas > 12) {
      nuevosErrores.personas = 'Número inválido (1-12 personas)';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ========== VALIDACIÓN COMPLETA (CON DISPONIBILIDAD) ==========
  const validarFormularioCompleto = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    const telefonoRegex = /^[0-9]{9,15}$/;
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'Teléfono inválido (9-15 dígitos)';
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria';
    } else {
      const fechaSeleccionada = new Date(formData.fecha + 'T00:00:00');
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.hora) {
      nuevosErrores.hora = 'La hora es obligatoria';
    } else if (!validarHorario(formData.hora)) {
      nuevosErrores.hora = 'Horario permitido: 9:00 AM - 10:00 PM';
    }

    if (!formData.personas || formData.personas < 1 || formData.personas > 12) {
      nuevosErrores.personas = 'Número inválido (1-12 personas)';
    }

    if (!formData.disponibilidadConfirmada) {
      nuevosErrores.disponibilidad = 'Debes verificar la disponibilidad primero';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ========== SOLICITAR RESERVA (PENDIENTE) ==========
  const handleSolicitarReserva = () => {
    if (!validarFormularioBasico()) {
      const primerError = Object.values(errors)[0];
      alert(`${primerError || 'Por favor, corrige los errores en el formulario'}`);
      return;
    }

    // Crear reserva con estado PENDIENTE
    const reservaPendiente = {
      ...formData,
      estado: 'PENDIENTE'
    };

    if (typeof onSepararMesa === 'function') {
      onSepararMesa(reservaPendiente);
    }
  };

  // ========== CONFIRMAR RESERVA (CONFIRMADA) ==========
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormularioCompleto()) {
      const primerError = Object.values(errors)[0];
      alert(`${primerError || 'Por favor, corrige los errores en el formulario'}`);
      return;
    }

    // Crear reserva con estado CONFIRMADA
    const reservaConfirmada = {
      ...formData,
      estado: 'CONFIRMADA'
    };

    if (typeof onConfirmar === 'function') {
      onConfirmar(reservaConfirmada);
    }
  };

  const getFechaMinima = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="reserva-container">
      <div className="reserva-header">
        <h1 className="reserva-titulo">RESERVA TU MESA EN LOS TRES SABORES</h1>
      </div>

      <div className="reserva-contenido">
        <form className="reserva-form" onSubmit={handleSubmit}>
          {/* ========== INFORMACIÓN PERSONAL ========== */}
          <div className="seccion-header">INFORMACIÓN PERSONAL</div>
          <div className="seccion-contenido">
            <div className="form-group">
              <label>
                Nombre completo <span className="requerido">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresar nombre completo..."
              />
              {errors.nombre && <span className="error-mensaje">{errors.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Teléfono <span className="requerido">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  className={`form-input ${errors.telefono ? 'input-error' : ''}`}
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ingresar teléfono..."
                />
                {errors.telefono && <span className="error-mensaje">{errors.telefono}</span>}
              </div>

              <div className="form-group">
                <label>
                  Email <span className="requerido">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresar email..."
                />
                {errors.email && <span className="error-mensaje">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* ========== DETALLE DE LA RESERVA ========== */}
          <div className="seccion-header">DETALLE DE LA RESERVA</div>
          <div className="seccion-contenido">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Fecha <span className="requerido">*</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  className={`form-input ${errors.fecha ? 'input-error' : ''}`}
                  value={formData.fecha}
                  onChange={handleChange}
                  min={getFechaMinima()}
                />
                {errors.fecha && <span className="error-mensaje">{errors.fecha}</span>}
              </div>

              <div className="form-group">
                <label>
                  Hora <span className="requerido">*</span>
                </label>
                <input
                  type="time"
                  name="hora"
                  className={`form-input ${errors.hora ? 'input-error' : ''}`}
                  value={formData.hora}
                  onChange={handleChange}
                  min="09:00"
                  max="22:00"
                />
                {errors.hora && <span className="error-mensaje">{errors.hora}</span>}
                <span className="form-ayuda"> <BsStopwatch /> Horario: 9:00 AM - 10:00 PM</span>
              </div>
            </div>

            <div className="form-group">
              <label>
                Número de personas <span className="requerido">*</span>
              </label>
              <input
                type="number"
                name="personas"
                className={`form-input ${errors.personas ? 'input-error' : ''}`}
                value={formData.personas}
                onChange={handleChange}
                placeholder="[1 - 12 personas]"
                min="1"
                max="12"
              />
              {errors.personas && <span className="error-mensaje">{errors.personas}</span>}
            </div>

            {/* ========== VERIFICAR DISPONIBILIDAD ========== */}
            <div className="verificar-disponibilidad-container">
              <button
                type="button"
                className={`btn-verificar-disponibilidad ${verificandoDisponibilidad ? 'verificando' : ''} ${disponibilidadVerificada ? 'verificado' : ''}`}
                onClick={verificarDisponibilidad}
                disabled={verificandoDisponibilidad || !formData.fecha || !formData.hora}
              >
                {verificandoDisponibilidad ? (
                  <>VERIFICANDO...</>
                ) : disponibilidadVerificada ? (
                  <>DISPONIBILIDAD CONFIRMADA</>
                ) : (
                  <>VERIFICAR DISPONIBILIDAD</>
                )}
              </button>
              {errors.disponibilidad && (
                <span className="error-mensaje">{errors.disponibilidad}</span>
              )}
            </div>

            {/* ========== CHECKBOX DE CONFIRMACIÓN ========== */}
            <div className={`disponibilidad-check ${disponibilidadVerificada ? 'confirmada' : ''}`}>
              <input
                type="checkbox"
                id="disponibilidad"
                name="disponibilidadConfirmada"
                checked={formData.disponibilidadConfirmada}
                onChange={handleChange}
                disabled={!disponibilidadVerificada}
              />
              <label htmlFor="disponibilidad">
                Disponibilidad confirmada para esta fecha y hora
              </label>
            </div>

            <div className="form-group">
              <label>Solicitudes especiales (Opcional)</label>
              <textarea
                name="solicitudes"
                className="textarea-campo"
                value={formData.solicitudes}
                onChange={handleChange}
                placeholder="[Área de texto multilínea]"
              />
            </div>
          </div>

          {/* ========== TRES BOTONES ========== */}
          <div className="form-botones-tres">
            <button 
              type="button" 
              className="btn-cancelar-form"
              onClick={onCancelar}
            >
              CANCELAR
            </button>

            <button 
              type="button" 
              className="btn-solicitar-reserva"
              onClick={handleSolicitarReserva}
            >
              SOLICITAR RESERVA
            </button>

            <button 
              type="submit" 
              className="btn-reservar"
              disabled={!formData.disponibilidadConfirmada}
            >
              CONFIRMAR RESERVA
            </button>
          </div>

          <div className="form-info-botones">
            <p className="info-texto-botones">
              <strong>Información:</strong><br/>
              • <strong>SOLICITAR RESERVA:</strong> Envía tu solicitud como PENDIENTE (sin verificar disponibilidad)<br/>
              • <strong>CONFIRMAR RESERVA:</strong> Reserva inmediata CONFIRMADA (requiere verificación de disponibilidad)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompFormReserva;
