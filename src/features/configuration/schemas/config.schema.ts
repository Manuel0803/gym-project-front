import * as z from 'zod';

export const configGeneralSchema = z.object({
  gymName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,20}$/, 'Debe ser un teléfono válido (ej: +54 9 11 1234-5678)')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .min(5, 'La dirección es muy corta')
    .max(150, 'Dirección demasiado larga'),
});

export const configSecuritySchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmNewPassword: z
      .string()
      .min(1, 'Por favor confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  });

export type GeneralFormValues = z.infer<typeof configGeneralSchema>;

export type SecurityFormValues = z.infer<typeof configSecuritySchema>;
