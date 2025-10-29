import { useEffect } from 'react';
import { Modal, Form, Input, Alert, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoftStore } from '../stores/loftStore';
import { loftSchema } from '../utils/validation';
import { Loft } from '../types';

const { TextArea } = Input;

type LoftFormData = z.infer<typeof loftSchema>;

interface LoftFormProps {
  open: boolean;
  loft?: Loft;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LoftForm({ open, loft, onSuccess, onCancel }: LoftFormProps) {
  const { createLoft, updateLoft, isLoading, error, clearError } = useLoftStore();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoftFormData>({
    resolver: zodResolver(loftSchema),
    defaultValues: loft || {
      name: '',
      location: '',
      description: '',
    },
  });

  useEffect(() => {
    if (loft) {
      reset(loft);
    } else {
      reset({
        name: '',
        location: '',
        description: '',
      });
    }
  }, [loft, reset, open]);

  const onSubmit = async (data: LoftFormData) => {
    clearError();
    try {
      if (loft) {
        await updateLoft(loft._id, data);
        message.success('Palomar actualizado correctamente');
      } else {
        await createLoft(data.name, data.location, data.description);
        message.success('Palomar creado correctamente');
      }
      reset();
      onSuccess?.();
    } catch (error) {
      message.error('Error al guardar el palomar');
    }
  };

  const handleCancel = () => {
    reset();
    clearError();
    onCancel?.();
  };

  return (
    <Modal
      title={loft ? 'Editar Palomar' : 'Crear Nuevo Palomar'}
      open={open}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText={loft ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      confirmLoading={isLoading}
      destroyOnClose
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Form layout="vertical">
        <Form.Item
          label="Nombre"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Palomar Norte"
                disabled={isLoading}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Ubicación"
          validateStatus={errors.location ? 'error' : ''}
          help={errors.location?.message}
        >
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Madrid, España"
                disabled={isLoading}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Descripción"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Descripción del palomar..."
                rows={4}
                disabled={isLoading}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
