import { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError("Correo o contraseña inválidos.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#fef8f4',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem 3rem',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '1rem', color: '#0d1b2a' }}>
          Intranet <span style={{ color: '#f2711c' }}>Natstone</span>
        </h1>

        {user ? (
          <>
            <p>👤 Bienvenido, <strong>{user.email}</strong></p>

            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
            <a
             href="https://sites.google.com/view/intranetstone/inicio?authuser=1"
             target="_blank"
             rel="noopener noreferrer"
             style={styles.linkButton}
           >Intranet</a>

              <a href="https://sites.google.com/view/comercialstone/inicio?authuser=0" 
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
              style={styles.linkButton}>Avance de ventas</a>
              
              <a href="https://diligent-silky-bayberry.glitch.me/" 
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
              style={styles.linkButton}>Departamento Técnico</a>
              <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>Inventario</a>
              <a href="https://tuapp4.natstone.cl" style={styles.linkButton}>ONDAC</a>

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
            {error && <p style={{ color: 'crimson', marginTop: '1rem' }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
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
