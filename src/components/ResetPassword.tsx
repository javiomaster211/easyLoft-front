import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { resetPasswordSchema } from '../utils/validation';
import { useSearchParams } from 'react-router-dom';

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      return;
    }
    
    clearError();
    setSuccess(false);
    try {
      await resetPassword(token, data.password);
      setSuccess(true);
    } catch (error) {
      // Error manejado en el store
    }
  };

  if (!token) {
    return <div>Token de recuperación no válido</div>;
  }

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && (
        <div style={{ color: 'green' }}>
          Contraseña actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña.
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
        </button>
      </form>
    </div>
  );
}
