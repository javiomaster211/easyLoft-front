import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { forgotPasswordSchema } from '../utils/validation';

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    clearError();
    setSuccess(false);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      // Error manejado en el store
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && (
        <div style={{ color: 'green' }}>
          Si el email existe, recibirás instrucciones para restablecer tu contraseña
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>
      </form>
    </div>
  );
}
