import { useEffect, useState } from 'react';
import { useLoftStore } from '../stores/loftStore';

interface LoftListProps {
  onSelectLoft?: (loftId: string) => void;
  onCreateLoft?: () => void;
}

export function LoftList({ onSelectLoft, onCreateLoft }: LoftListProps) {
  const { lofts, fetchLofts, deleteLoft, isLoading, error } = useLoftStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLofts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este palomar?')) {
      try {
        await deleteLoft(id);
      } catch (error) {
        // Error manejado en el store
      }
    }
  };

  if (isLoading) {
    return <div>Cargando palomares...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Mis Palomares</h2>
      
      <button onClick={onCreateLoft}>Crear Nuevo Palomar</button>
      
      {lofts.length === 0 ? (
        <p>No tienes palomares registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lofts.map(loft => (
              <tr key={loft._id}>
                <td>{loft.name}</td>
                <td>{loft.location || '-'}</td>
                <td>{loft.description || '-'}</td>
                <td>
                  <button onClick={() => onSelectLoft?.(loft._id)}>Ver Palomas</button>
                  <button onClick={() => setEditingId(loft._id)}>Editar</button>
                  <button onClick={() => handleDelete(loft._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
