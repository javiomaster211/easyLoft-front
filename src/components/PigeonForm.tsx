import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Alert, message, Row, Col, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { usePigeonStore } from '../stores/pigeonStore';
import { useLoftStore } from '../stores/loftStore';
import { pigeonSchema } from '../utils/validation';
import { Pigeon } from '../types';

const { TextArea } = Input;
const { Option } = Select;

type PigeonFormData = z.infer<typeof pigeonSchema>;

interface PigeonFormProps {
  open: boolean;
  pigeon?: Pigeon;
  loftId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PigeonForm({ open, pigeon, loftId: defaultLoftId, onSuccess, onCancel }: PigeonFormProps) {
  const { createPigeon, updatePigeon, fetchPigeons, uploadImage, pigeons, isLoading, error, clearError } = usePigeonStore();
  const { lofts, fetchLofts } = useLoftStore();
  
  const [images, setImages] = useState({
    body: pigeon?.images?.body || '',
    eye: pigeon?.images?.eye || '',
    plumage: pigeon?.images?.plumage || '',
  });
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PigeonFormData>({
    resolver: zodResolver(pigeonSchema),
    defaultValues: pigeon ? {
      ...pigeon,
      birthDate: pigeon.birthDate.split('T')[0],
    } : {
      loftId: defaultLoftId || '',
      name: '',
      ringNumber: '',
      birthDate: new Date().toISOString().split('T')[0],
      sex: 'unknown',
      plumage: '',
      dimensions: '',
      originalBreeder: '',
      fatherId: '',
      motherId: '',
    },
  });

  const selectedLoftId = watch('loftId') || defaultLoftId;

  useEffect(() => {
    fetchLofts();
    fetchPigeons();
  }, []);

  useEffect(() => {
    if (defaultLoftId) {
      setValue('loftId', defaultLoftId);
    }
  }, [defaultLoftId, setValue]);

  useEffect(() => {
    if (pigeon) {
      reset({
        ...pigeon,
        birthDate: pigeon.birthDate.split('T')[0],
      });
      setImages(pigeon.images || { body: '', eye: '', plumage: '' });
    } else if (open) {
      reset({
        loftId: defaultLoftId || '',
        name: '',
        ringNumber: '',
        birthDate: new Date().toISOString().split('T')[0],
        sex: 'unknown',
        plumage: '',
        dimensions: '',
        originalBreeder: '',
        fatherId: '',
        motherId: '',
      });
      setImages({ body: '', eye: '', plumage: '' });
    }
  }, [pigeon, reset, open, defaultLoftId]);

  const handleImageUpload = async (type: 'body' | 'eye' | 'plumage', file: File) => {
    setUploadingImage(type);
    try {
      const response = await uploadImage(file);
      setImages(prev => ({
        ...prev,
        [type]: response.url,
      }));
      message.success(`Imagen de ${type === 'body' ? 'cuerpo' : type === 'eye' ? 'ojo' : 'plumaje'} subida correctamente`);
    } catch (error) {
      message.error('Error al subir la imagen');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleRemoveImage = (type: 'body' | 'eye' | 'plumage') => {
    setImages(prev => ({
      ...prev,
      [type]: '',
    }));
  };

  const onSubmit = async (data: PigeonFormData) => {
    clearError();
    try {
      const pigeonData = {
        ...data,
        loftId: selectedLoftId || lofts[0]?._id,
        images,
      };

      if (pigeon) {
        await updatePigeon(pigeon._id, pigeonData);
        message.success('Paloma actualizada correctamente');
      } else {
        await createPigeon(pigeonData);
        message.success('Paloma creada correctamente');
      }
      
      reset();
      setImages({ body: '', eye: '', plumage: '' });
      onSuccess?.();
    } catch (error) {
      message.error('Error al guardar la paloma');
    }
  };

  const handleCancel = () => {
    reset();
    clearError();
    setImages({ body: '', eye: '', plumage: '' });
    onCancel?.();
  };

  // Filtrar palomas disponibles como padre/madre (del mismo palomar)
  const availablePigeons = pigeons.filter(p => 
    p.loftId === selectedLoftId && p._id !== pigeon?._id
  );
  const availableFathers = availablePigeons.filter(p => p.sex === 'male');
  const availableMothers = availablePigeons.filter(p => p.sex === 'female');

  const renderImageUpload = (type: 'body' | 'eye' | 'plumage', label: string) => {
    const imageUrl = images[type];
    const isUploading = uploadingImage === type;

    return (
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{label}</div>
        {imageUrl ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Image
              src={`${import.meta.env.VITE_API_URL}${imageUrl}`}
              alt={label}
              width={200}
              height={150}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
            <DeleteOutlined
              onClick={() => handleRemoveImage(type)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: 20,
                color: 'red',
                background: 'white',
                borderRadius: '50%',
                padding: 4,
                cursor: 'pointer',
              }}
            />
          </div>
        ) : (
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(type, file);
              return false; // Prevenir upload automático
            }}
            disabled={isUploading}
          >
            <div style={{
              width: 200,
              height: 150,
              border: '2px dashed #d9d9d9',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#fafafa',
            }}>
              {isUploading ? (
                <div>Subiendo...</div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                  <div style={{ marginTop: 8, color: '#999' }}>Subir imagen</div>
                </div>
              )}
            </div>
          </Upload>
        )}
      </div>
    );
  };

  return (
    <Modal
      title={pigeon ? 'Editar Paloma' : 'Agregar Nueva Paloma'}
      open={open}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      okText={pigeon ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      confirmLoading={isLoading}
      width={800}
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
        <Row gutter={16}>
          {!defaultLoftId && (
            <Col span={24}>
              <Form.Item
                label="Palomar"
                required
                validateStatus={errors.loftId ? 'error' : ''}
                help={errors.loftId?.message}
              >
                <Controller
                  name="loftId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Selecciona un palomar" disabled={isLoading}>
                      {lofts.map(loft => (
                        <Option key={loft._id} value={loft._id}>{loft.name}</Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
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
                  <Input {...field} placeholder="Ej: Rayo de Plata" disabled={isLoading} />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Número de Anilla"
              validateStatus={errors.ringNumber ? 'error' : ''}
              help={errors.ringNumber?.message}
            >
              <Controller
                name="ringNumber"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Ej: ES-2024-001" disabled={isLoading} />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Fecha de Nacimiento"
              required
              validateStatus={errors.birthDate ? 'error' : ''}
              help={errors.birthDate?.message}
            >
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                    style={{ width: '100%' }}
                    disabled={isLoading}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Sexo"
              required
              validateStatus={errors.sex ? 'error' : ''}
              help={errors.sex?.message}
            >
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <Option value="male">Macho</Option>
                    <Option value="female">Hembra</Option>
                    <Option value="unknown">Desconocido</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Criador Original"
              required
              validateStatus={errors.originalBreeder ? 'error' : ''}
              help={errors.originalBreeder?.message}
            >
              <Controller
                name="originalBreeder"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nombre del criador" disabled={isLoading} />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Padre"
              validateStatus={errors.fatherId ? 'error' : ''}
              help={errors.fatherId?.message}
            >
              <Controller
                name="fatherId"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Sin padre registrado" disabled={isLoading} allowClear>
                    {availableFathers.map(p => (
                      <Option key={p._id} value={p._id}>
                        {p.name} {p.ringNumber ? `(${p.ringNumber})` : ''}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Madre"
              validateStatus={errors.motherId ? 'error' : ''}
              help={errors.motherId?.message}
            >
              <Controller
                name="motherId"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Sin madre registrada" disabled={isLoading} allowClear>
                    {availableMothers.map(p => (
                      <Option key={p._id} value={p._id}>
                        {p.name} {p.ringNumber ? `(${p.ringNumber})` : ''}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Plumaje"
              validateStatus={errors.plumage ? 'error' : ''}
              help={errors.plumage?.message}
            >
              <Controller
                name="plumage"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Describe el plumaje (color, patrones, etc.)"
                    rows={2}
                    disabled={isLoading}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Dimensiones"
              validateStatus={errors.dimensions ? 'error' : ''}
              help={errors.dimensions?.message}
            >
              <Controller
                name="dimensions"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Envergadura, altura, peso, etc."
                    rows={2}
                    disabled={isLoading}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Imágenes</div>
          </Col>

          <Col span={8}>
            {renderImageUpload('body', 'Foto del Cuerpo')}
          </Col>

          <Col span={8}>
            {renderImageUpload('eye', 'Foto del Ojo')}
          </Col>

          <Col span={8}>
            {renderImageUpload('plumage', 'Foto del Plumaje')}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
