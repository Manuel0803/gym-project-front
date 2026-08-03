import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MembersService } from '../services/members.service';
import {
  CreateMemberPayload,
  UpdateMemberPayload,
} from '../interfaces/members.interface';
import toast from 'react-hot-toast';

export const useMembers = (
  page: number = 1,
  limit: number = 10,
  term?: string,
  state?: string
) => {
  return useQuery({
    queryKey: ['members', { page, limit, term, state }],
    queryFn: () => MembersService.getAll(page, limit, term, state),
    staleTime: 1000 * 10,
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => MembersService.getById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemberPayload) =>
      MembersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro creado con éxito');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Ocurrió un error al crear el miembro';
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message);
      }
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMemberPayload;
    }) => MembersService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: ['member', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      
      toast.success('Miembro actualizado con éxito');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'No se pudo actualizar el miembro';
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message);
      }
    },
  });
};

export const useDeactivateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MembersService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['member', id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Socio desactivado correctamente');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al desactivar el socio'
      );
    },
  });
};
