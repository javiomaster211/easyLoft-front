import { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useLoftStore } from '../stores/loftStore';
import { LoftForm } from './LoftForm';
import { Loft } from '../types';

interface LoftListProps {
  onSelectLoft?: (loftId: string) => void;
  onCreateLoft?: () => void;
}

export function LoftList({ onSelectLoft }: LoftListProps) {
  const { lofts, fetchLofts, deleteLoft, isLoading, error } = useLoftStore();
  const [showModal, setShowModal] = useState(false);
  const [editingLoft, setEditingLoft] = useState<Loft | undefined>(undefined);

  useEffect(() => {
    fetchLofts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLoft(id);
      message.success('Palomar eliminado correctamente');
    } catch (error) {
      message.error('Error al eliminar el palomar');
    }
  };

  const handleEdit = (loft: Loft) => {
    setEditingLoft(loft);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingLoft(undefined);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingLoft(undefined);
    fetchLofts();
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setEditingLoft(undefined);
  };

  const columns: ColumnsType<Loft> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ubicación',
      dataIndex: 'location',
      key: 'location',
      render: (text) => text || '-',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '-',
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onSelectLoft?.(record._id)}
          >
            Ver Palomas
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Eliminar palomar"
            description="¿Estás seguro de eliminar este palomar?"
            onConfirm={() => handleDelete(record._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Mis Palomares</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Crear Nuevo Palomar
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={lofts}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} palomares`,
        }}
        locale={{
          emptyText: 'No tienes palomares registrados',
        }}
      />

      <LoftForm
        open={showModal}
        loft={editingLoft}
        onSuccess={handleModalSuccess}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
