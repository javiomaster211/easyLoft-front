import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { loginSchema } from '../utils/validation';

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error manejado en el store
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
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

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
