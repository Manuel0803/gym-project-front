import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentsService } from '../services/payments.service';
import {
  CreatePaymentPayload,
  UpdatePaymentPayload,
} from '../interfaces/payments.interface';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      PaymentsService.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({
        queryKey: ['member', variables.memberUuid],
      });
      toast.success('Pago registrado con éxito');
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message ||
        'Ocurrió un error al registrar el pago';
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message);
      }
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePaymentPayload;
    }) => PaymentsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      toast.success('Pago actualizado con éxito');
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error.response?.data?.message ||
        'Ocurrió un error al actualizar el pago';
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message);
      }
    },
  });
};
