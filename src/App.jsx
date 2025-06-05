import { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const ref = doc(db, "Usuarios", currentUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        setUser({
          ...currentUser,
          rol: data.rol || null,
          nombre: data.nombre || "",
          hoja: data.hoja || null
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      setMessage('');
    } catch (err) {
      setError("Correo o contraseña inválidos.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Ingresa tu correo para restablecer la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError('');
      setMessage("📧 Revisa tu correo para restablecer la contraseña.");
    } catch (err) {
      setError("No se pudo enviar el correo. Verifica que el correo sea válido.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Intranet <span style={styles.highlight}>Natstone</span>
        </h1>

        {user ? (
          <>
            <p>
              👤 Bienvenido, <strong>{user.nombre || user.email}</strong>
            </p>

            <div style={styles.linkGroup}>
              <a
                href="https://sites.google.com/view/intranetstone/inicio?authuser=1"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.linkButton}
              >
                Intranet
              </a>

              {user.rol === 'admin' && (
                <>
                  <a href="https://sites.google.com/view/avance-mensual/inicio" style={styles.linkButton}>Avance de ventas</a>
                  <a href="https://diligent-silky-bayberry.glitch.me/" style={styles.linkButton}>Beta</a>
                  <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
                  <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
                </>
              )}

              {user.rol === 'ventas' && (
                <>
                  <a href="https://sites.google.com/view/avance-mensual/inicio" style={styles.linkButton}>Avance de ventas</a>
                  {user.hoja && (
                    <a href={user.hoja} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>
                      Ir a mi hoja de ventas
                    </a>
                  )}
                  <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
                  <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
                </>
              )}

              {user.rol === 'tecnico' && (
                <>
                  <a href="https://diligent-silky-bayberry.glitch.me/" style={styles.linkButton}>Beta</a>
                  <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
                </>
              )}

              {['operaciones', 'administracion'].includes(user.rol) && (
                <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Beta</a>
              )}

              {/* Botón de reunión comercial solo para admin y ventas */}
              {(user.rol === 'admin' || user.rol === 'ventas') && (
                <a
                  href="https://meet.google.com/ihh-cnpc-cgh"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.linkButton, backgroundColor: '#34a853' }}
                >
                  📞 Ir a Reunión Comercial
                </a>
              )}
            </div>

            <button onClick={handleLogout} style={styles.buttonLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleLogin} style={styles.buttonPrimary}>Iniciar sesión</button>
            <button onClick={handlePasswordReset} style={styles.resetLink}>¿Olvidaste tu contraseña?</button>
            {error && <p style={{ color: 'crimson', marginTop: '1rem' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#fef8f4',
    fontFamily: 'Segoe UI, sans-serif'
  },
  card: {
    background: '#fff',
    padding: '2rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  },
  title: {
    marginBottom: '1rem',
    color: '#0d1b2a'
  },
  highlight: {
    color: '#f2711c'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  buttonPrimary: {
    marginTop: '1rem',
    padding: '0.75rem 1.2rem',
    backgroundColor: '#f2711c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%'
  },
  buttonLogout: {
    marginTop: '2rem',
    padding: '0.6rem 1rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%'
  },
  resetLink: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    border: 'none',
    background: 'none',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  linkGroup: {
    marginTop: '2rem',
    display: 'grid',
    gap: '1rem'
  },
  linkButton: {
    display: 'block',
    padding: '0.8rem',
    backgroundColor: '#f2711c',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold'
  }
};

export default App;
