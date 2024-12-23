import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Asegúrate de que esto apunte a tu servidor backend
const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  cors: {
    origin: "http://localhost:3001"
  }
});

function App() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [unido, setUnido] = useState(false);

  useEffect(() => {
    socket.on('mensaje', mensaje => {
      setMensajes(prev => [...prev, mensaje]);
    });

    socket.on('usuarios', usuarios => {
      setUsuarios(usuarios);
    });

    return () => {
      socket.off('mensaje');
      socket.off('usuarios');
    };
  }, []);

  const unirse = (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      socket.emit('unirse', nombre);
      setUnido(true);
    }
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (mensaje.trim() && nombre) {
      socket.emit('enviarMensaje', { usuario: nombre, texto: mensaje });
      setMensaje('');
    }
  };

  return (
    <div className="chat">
      <div className="sidebar">
        <h2>Usuarios Conectados ({usuarios.length})</h2>
        <div className="usuarios-lista">
          {usuarios.map((usuario, index) => (
            <div key={index} className="usuario-item">
              {usuario.nombre}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="mensajes">
          {mensajes.map((msg, index) => (
            <div 
              key={index} 
              className={`mensaje ${msg.usuario === nombre ? 'propio' : 'otro'}`}
            >
              <strong>{msg.usuario}:</strong> {msg.texto}
            </div>
          ))}
        </div>

        {!unido ? (
          <form onSubmit={unirse} className="formulario-nombre">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
            <button type="submit">Unirse al Chat</button>
          </form>
        ) : (
          <form onSubmit={enviarMensaje} className="formulario-mensaje">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              required
            />
            <button type="submit">Enviar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
