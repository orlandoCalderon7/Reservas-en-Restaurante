import React, { useState } from 'react';
import './CompRegistro.css';

function CompRegistro({ onVolver, onRegistroExitoso }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!nombre || !correo || !password || !confirmarPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor ingresa un correo válido');
      return;
    }

    // Guardar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar si el correo ya existe
    if (usuarios.some(u => u.correo === correo)) {
      alert('Este correo ya está registrado');
      return;
    }

    usuarios.push({ nombre, correo, password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('¡Registro exitoso! Ya puedes iniciar sesión');
    onRegistroExitoso();
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          
          <h1 className="titulo-restaurante">LOS TRES SABORES</h1>
          <p className="subtitulo-registro">Sistema de gestión de Reservas</p>
        </div>

        <div className="registro-form-container">
          <h2>REGISTRO DE USUARIO</h2>

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-group">
              <label>
                Nombre Completo <span className="requerido">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese su nombre completo aquí"
                className="input-campo"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Correo <span className="requerido">*</span>
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ingresa tu correo..."
                className="input-campo"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Contraseña <span className="requerido">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                className="input-campo"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Confirma tu Contraseña <span className="requerido">*</span>
              </label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Confirma tu contraseña..."
                className="input-campo"
                required
              />
            </div>

            <div className="registro-botones">
              <button 
                type="button"
                className="btn-volver-registro"
                onClick={onVolver}
              >
                VOLVER
              </button>
              <button 
                type="submit"
                className="btn-registrar"
              >
                REGISTRAR
              </button>
            </div>
          </form>
        </div>

        <div className="footer-registro">
          <p>2025 LOS TRES SABORES - TODOS LOS DERECHOS RESERVADOS</p>
        </div>
      </div>
    </div>
  );
}

export default CompRegistro;
