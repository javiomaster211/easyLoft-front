import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoftStore } from '../stores/loftStore';
import { loftSchema } from '../utils/validation';
import { Loft } from '../types';

type LoftFormData = z.infer<typeof loftSchema>;

interface LoftFormProps {
  loft?: Loft;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LoftForm({ loft, onSuccess, onCancel }: LoftFormProps) {
  const { createLoft, updateLoft, isLoading, error, clearError } = useLoftStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoftFormData>({
    resolver: zodResolver(loftSchema),
    defaultValues: loft || {},
  });

  useEffect(() => {
    if (loft) {
      reset(loft);
    }
  }, [loft, reset]);

  const onSubmit = async (data: LoftFormData) => {
    clearError();
    try {
      if (loft) {
        await updateLoft(loft._id, data);
      } else {
        await createLoft(data.name, data.location, data.description);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      // Error manejado en el store
    }
  };

  return (
    <div>
      <h3>{loft ? 'Editar Palomar' : 'Crear Nuevo Palomar'}</h3>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nombre *</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="location">Ubicación</label>
          <input
            id="location"
            type="text"
            {...register('location')}
            disabled={isLoading}
          />
          {errors.location && <span>{errors.location.message}</span>}
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && <span>{errors.description.message}</span>}
        </div>

        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : loft ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
