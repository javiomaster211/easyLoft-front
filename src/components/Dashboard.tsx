import { useAuthStore } from '../stores/authStore';

export function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <h1>Dashboard - EasyLoft</h1>
      <p>Bienvenido, {user?.name}!</p>
      
      <div>
        <h2>Estadísticas Generales</h2>
        <ul>
          <li>Total de Palomares: 0</li>
          <li>Total de Palomas: 0</li>
          <li>Machos: 0</li>
          <li>Hembras: 0</li>
        </ul>
      </div>

      <div>
        <h3>Acciones Rápidas</h3>
        <button>Mis Palomares</button>
        <button>Todas mis Palomas</button>
        <button>Importar Datos</button>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
