import * as z from 'zod';

export const planSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'Nombre demasiado largo'),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const cleanString = val.replace(/\./g, ''); 
        return Math.round(Number(cleanString)); 
      }
      return Math.round(val);
    })
    .refine((val) => !isNaN(val) && val > 0, { message: 'El precio debe ser mayor a 0' })
    .refine((val) => val <= 10000000, { message: 'Precio excesivo' }),
  durationDays: z.coerce.number().positive('La duración debe ser positiva').max(3650, 'La duración no puede exceder los 10 años'),
  description: z.string().max(500, 'La descripción no puede superar los 500 caracteres').optional(),
});

export type PlanFormValues = z.infer<typeof planSchema>;
