import { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const ref = doc(db, "Usuarios", currentUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        setUser({ ...currentUser, rol: data.rol || null, nombre: data.nombre || "" });
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
    } catch (err) {
      setError("Correo o contraseña inválidos.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
              <a href="https://sites.google.com/view/intranetstone/inicio?authuser=1" target="_blank" rel="noopener noreferrer" style={styles.linkButton}>Intranet</a>

              {user.rol === 'admin' && (
                <>
                  <a href="/admin" style={styles.linkButton}>Panel Admin</a>
                  <a href="/dashboard" style={styles.linkButton}>Dashboard</a>
                </>
              )}

              {user.rol === 'vendedor' && (
                <a href="https://comercial.natstone.cl" style={styles.linkButton}>Avance de ventas</a>
              )}

              {user.rol === 'tecnico' && (
                <a href="https://diligent-silky-bayberry.glitch.me/" style={styles.linkButton}>Departamento Técnico</a>
              )}

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

// Estilos se mantienen iguales...
const styles = { /* ...igual que antes... */ };

export default App;
