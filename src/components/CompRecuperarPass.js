import React, { useState } from 'react';
import './CompRecuperarPass.css';

function CompRecuperarPass({ onVolver, onEnviarCodigo }) {
  const [correo, setCorreo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!correo) {
      alert('Por favor ingresa tu correo');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor ingresa un correo válido');
      return;
    }

    // Verificar si el correo existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.correo === correo);

    if (!usuario) {
      alert('No existe una cuenta con este correo');
      return;
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código temporalmente
    localStorage.setItem('codigoRecuperacion', codigo);
    localStorage.setItem('correoRecuperacion', correo);

    alert(`Código enviado: ${codigo}\n(En producción se enviaría por email)`);
    onEnviarCodigo(correo);
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <div className="recuperar-header">
          
          <h1 className="titulo-restaurante">LOS TRES SABORES</h1>
          <p className="subtitulo-recuperar">Sistema de gestión de Reservas</p>
        </div>

        <div className="recuperar-form-container">
          <h2>¿NO RECUERDAS LA CONTRASEÑA?</h2>
          <p className="mensaje-ayuda">
            ¡NO TE PREOCUPES!<br />
            INGRESA TU CORREO Y TE AYUDAREMOS.
          </p>

          <form onSubmit={handleSubmit} className="recuperar-form">
            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ingresa tu correo..."
                className="input-campo"
                required
              />
            </div>

            <div className="recuperar-botones">
              <button 
                type="button"
                className="btn-volver-recuperar"
                onClick={onVolver}
              >
                VOLVER
              </button>
              <button 
                type="submit"
                className="btn-enviar-codigo"
              >
                REGISTRAR
              </button>
            </div>
          </form>
        </div>

        <div className="footer-recuperar">
          <p>2025 LOS TRES SABORES - TODOS LOS DERECHOS RESERVADOS</p>
        </div>
      </div>
    </div>
  );
}

export default CompRecuperarPass;
