import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { registerSchema } from '../utils/validation';

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    try {
      await registerUser(data.email, data.password, data.name, data.phone);
    } catch (error) {
      // Error manejado en el store
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

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

        <div>
          <label htmlFor="phone">Teléfono (opcional)</label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            disabled={isLoading}
          />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
