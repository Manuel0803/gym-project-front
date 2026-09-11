import * as z from 'zod';

export const editMemberSchema = z.object({
  dni: z
    .string()
    .min(7, 'El DNI debe tener al menos 7 caracteres')
    .max(9, 'El DNI no puede superar los 9 caracteres')
    .regex(/^[0-9]+$/, 'El DNI solo debe contener números'),
  name: z
    .string()
    .trim()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'Nombre demasiado largo'),
  surname: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido demasiado largo'),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, 'La fecha de nacimiento no puede estar en el futuro'),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'El teléfono debe tener entre 10 y 15 dígitos')
    .optional()
    .or(z.literal('')),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden superar los 500 caracteres')
    .optional()
    .or(z.literal('')),
  emergencyName: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')),
  emergencyRelation: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  const hasEmergencyData = !!(data.emergencyName || data.emergencyPhone || data.emergencyRelation);
  
  if (hasEmergencyData) {
    if (!data.emergencyName || data.emergencyName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre es obligatorio',
        path: ['emergencyName'],
      });
    }
    if (!data.emergencyPhone || !/^\+?[0-9]{10,15}$/.test(data.emergencyPhone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Teléfono inválido (10 a 15 dígitos)',
        path: ['emergencyPhone'],
      });
    }
    if (!data.emergencyRelation || data.emergencyRelation.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El parentesco es obligatorio',
        path: ['emergencyRelation'],
      });
    }
  }
});

export type EditMemberFormValues = z.infer<typeof editMemberSchema>;
