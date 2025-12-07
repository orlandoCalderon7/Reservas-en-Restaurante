import React, { useState } from 'react';

function CompLogin({ tipo, onLogin, onRegistro, onRecuperar }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (tipo === 'admin') {
      // Credenciales de administrador
      if (
        (emailOrUsername === 'admin' || emailOrUsername === 'orlando') && 
        password === 'admin123'
      ) {
        onLogin(emailOrUsername, 'admin');
      } else {
        alert('Credenciales de administrador incorrectas\n\nUsuario: admin u orlando\nContraseña: admin123');
      }
    } else {
      // Login de cliente
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find(
        u => u.correo === emailOrUsername && u.password === password
      );

      if (usuario) {
        onLogin(emailOrUsername, 'cliente');
      } else {
        alert(' Credenciales incorrectas. Por favor verifica tus datos o regístrate.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="icono-login">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>
            {tipo === 'admin' ? 'ACCESO ADMINISTRADOR' : 'ACCESO CLIENTE'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', marginTop: '10px' }}>
            {tipo === 'admin' 
              ? 'Gestiona las reservas del restaurante' 
              : 'Ingresa para realizar tu reserva'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {tipo === 'admin' ? 'Usuario' : 'Correo Electrónico'}
            </label>
            <input
              type={tipo === 'admin' ? 'text' : 'email'}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={tipo === 'admin' ? 'Ingrese su usuario' : 'Ingrese su correo electrónico'}
              className="input-campo"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="input-campo"
              required
            />
          </div>

          {tipo === 'cliente' && (
            <button 
              type="button"
              className="btn-olvide"
              onClick={onRecuperar}
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          <div className="recordar-credenciales">
            <input
              type="checkbox"
              id="recordar"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
            <label htmlFor="recordar">
              Recordar mis credenciales
            </label>
          </div>

          <button type="submit" className="btn-ingresar-login">
            INGRESAR
          </button>

          {tipo === 'cliente' && (
            <div className="registro-seccion">
              <div className="linea-divisora"></div>
              <p>¿No tienes una cuenta?</p>
              <button 
                type="button"
                className="btn-registrarse"
                onClick={onRegistro}
              >
                REGÍSTRATE AQUÍ
              </button>
            </div>
          )}

          {tipo === 'admin' && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <p style={{ 
                fontSize: '0.85rem', 
                color: '#92400e',
                margin: 0,
                textAlign: 'center'
              }}>
                <strong>💡 Credenciales de prueba:</strong><br/>
                Usuario: <code>admin</code> u <code>orlando</code><br/>
                Contraseña: <code>admin123</code>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CompLogin;
