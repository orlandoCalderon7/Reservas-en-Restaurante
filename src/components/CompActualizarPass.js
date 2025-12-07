import React, { useState } from 'react';
import './CompActualizarPass.css';

function CompActualizarPass({ correo, onVolver, onActualizacionExitosa }) {
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!codigo || !nuevaPassword || !confirmarPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Verificar código
    const codigoGuardado = localStorage.getItem('codigoRecuperacion');
    if (codigo !== codigoGuardado) {
      alert('Código incorrecto');
      return;
    }

    // Verificar que las contraseñas coincidan
    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Actualizar contraseña
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const correoRecuperacion = localStorage.getItem('correoRecuperacion');
    const usuarioIndex = usuarios.findIndex(u => u.correo === correoRecuperacion);

    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].password = nuevaPassword;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Limpiar datos temporales
      localStorage.removeItem('codigoRecuperacion');
      localStorage.removeItem('correoRecuperacion');

      alert('¡Contraseña actualizada exitosamente!');
      onActualizacionExitosa();
    } else {
      alert('Error al actualizar la contraseña');
    }
  };

  return (
    <div className="actualizar-container">
      <div className="actualizar-card">
        <div className="actualizar-header">
          <img src="/logo-restaurante.png" alt="Los Tres Sabores" className="logo-actualizar" />
          <h1 className="titulo-restaurante">LOS TRES SABORES</h1>
          <p className="subtitulo-actualizar">Sistema de gestión de Reservas</p>
        </div>

        <div className="actualizar-form-container">
          <h2>ACTUALIZA CONTRASEÑA</h2>

          <form onSubmit={handleSubmit} className="actualizar-form">
            <div className="form-group">
              <label>
                Código de verificación <span className="requerido">*</span>
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código enviado por correo..."
                className="input-campo"
                maxLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Nueva Contraseña <span className="requerido">*</span>
              </label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="••••••"
                className="input-campo"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Confirmar Contraseña <span className="requerido">*</span>
              </label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="••••••"
                className="input-campo"
                required
              />
            </div>

            <div className="actualizar-botones">
              <button 
                type="button"
                className="btn-volver-actualizar"
                onClick={onVolver}
              >
                VOLVER
              </button>
              <button 
                type="submit"
                className="btn-actualizar"
              >
                ACTUALIZAR
              </button>
            </div>
          </form>
        </div>

        <div className="footer-actualizar">
          <p>2025 LOS TRES SABORES - TODOS LOS DERECHOS RESERVADOS</p>
        </div>
      </div>
    </div>
  );
}

export default CompActualizarPass;
