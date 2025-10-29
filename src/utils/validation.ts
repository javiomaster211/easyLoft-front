import { z } from 'zod';

// Schema para registro
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().optional(),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Schema para forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

// Schema para reset password
export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema para palomar
export const loftSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  location: z.string().optional(),
  description: z.string().optional(),
});

// Schema para paloma
export const pigeonSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  ringNumber: z.string().optional(),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  sex: z.enum(['male', 'female', 'unknown']),
  plumage: z.string().optional(),
  dimensions: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  originalBreeder: z.string().min(1, 'El criador original es requerido'),
});

// Schema para compra
export const purchaseSchema = z.object({
  sellerName: z.string().min(1, 'El nombre del vendedor es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  price: z.number().optional(),
  notes: z.string().optional(),
});

// Schema para venta
export const saleSchema = z.object({
  buyerName: z.string().min(1, 'El nombre del comprador es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  price: z.number().optional(),
  notes: z.string().optional(),
});
