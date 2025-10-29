import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Image,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Card,
  Tag,
  message,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { usePigeonStore } from '../stores/pigeonStore';
import { useLoftStore } from '../stores/loftStore';
import { PigeonForm } from './PigeonForm';
import { Pigeon } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface PigeonTableProps {
  loftId?: string;
  onSelectPigeon?: (pigeon: Pigeon) => void;
  onCreatePigeon?: () => void;
}

export function PigeonTable({ loftId, onSelectPigeon }: PigeonTableProps) {
  const { pigeons, fetchPigeons, fetchPigeonsByLoft, deletePigeon, isLoading } = usePigeonStore();
  const { lofts, fetchLofts } = useLoftStore();
  
  // Estados para modal y vistas
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Estados para filtros
  const [searchText, setSearchText] = useState('');
  const [selectedSex, setSelectedSex] = useState<string | undefined>(undefined);
  const [selectedLofts, setSelectedLofts] = useState<string[]>([]);
  const [selectedPlumage, setSelectedPlumage] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [hasParents, setHasParents] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (loftId) {
      fetchPigeonsByLoft(loftId);
    } else {
      fetchPigeons();
      fetchLofts();
    }
  }, [loftId]);

  // Guardar filtros en localStorage
  useEffect(() => {
    const filters = {
      searchText,
      selectedSex,
      selectedLofts,
      selectedPlumage,
      hasParents,
      viewMode,
    };
    localStorage.setItem('pigeonTableFilters', JSON.stringify(filters));
  }, [searchText, selectedSex, selectedLofts, selectedPlumage, hasParents, viewMode]);

  // Cargar filtros desde localStorage al montar
  useEffect(() => {
    const savedFilters = localStorage.getItem('pigeonTableFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setSearchText(filters.searchText || '');
        setSelectedSex(filters.selectedSex);
        setSelectedLofts(filters.selectedLofts || []);
        setSelectedPlumage(filters.selectedPlumage);
        setHasParents(filters.hasParents);
        setViewMode(filters.viewMode || 'table');
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePigeon(id);
      message.success('Paloma eliminada correctamente');
    } catch (error) {
      message.error('Error al eliminar la paloma');
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    if (loftId) {
      fetchPigeonsByLoft(loftId);
    } else {
      fetchPigeons();
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedSex(undefined);
    setSelectedLofts([]);
    setSelectedPlumage(undefined);
    setDateRange(null);
    setHasParents(undefined);
  };

  // Aplicar filtros a los datos
  const filteredPigeons = pigeons.filter((pigeon) => {
    // Filtro de búsqueda
    if (searchText) {
      const search = searchText.toLowerCase();
      const matchName = pigeon.name.toLowerCase().includes(search);
      const matchRing = pigeon.ringNumber?.toLowerCase().includes(search);
      if (!matchName && !matchRing) return false;
    }

    // Filtro por sexo
    if (selectedSex && pigeon.sex !== selectedSex) return false;

    // Filtro por palomar (múltiple)
    if (selectedLofts.length > 0 && !selectedLofts.includes(pigeon.loftId)) return false;

    // Filtro por plumaje
    if (selectedPlumage && (!pigeon.plumage || !pigeon.plumage.toLowerCase().includes(selectedPlumage.toLowerCase()))) {
      return false;
    }

    // Filtro por fecha de nacimiento
    if (dateRange && dateRange[0] && dateRange[1]) {
      const birthDate = dayjs(pigeon.birthDate);
      if (birthDate.isBefore(dateRange[0]) || birthDate.isAfter(dateRange[1])) {
        return false;
      }
    }

    // Filtro por padres asignados
    if (hasParents !== undefined) {
      const hasFatherOrMother = !!pigeon.fatherId || !!pigeon.motherId;
      if (hasParents && !hasFatherOrMother) return false;
      if (!hasParents && hasFatherOrMother) return false;
    }

    return true;
  });

  // Obtener lista única de plumajes para el filtro
  const uniquePlumages = Array.from(new Set(pigeons.map(p => p.plumage).filter(Boolean)));

  const columns: ColumnsType<Pigeon> = [
    {
      title: 'Foto',
      dataIndex: ['images', 'body'],
      key: 'image',
      width: 80,
      render: (imageUrl, record) => {
        if (imageUrl) {
          return (
            <Image
              src={`${import.meta.env.VITE_API_URL}${imageUrl}`}
              alt={record.name}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          );
        }
        return <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4 }} />;
      },
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Anilla',
      dataIndex: 'ringNumber',
      key: 'ringNumber',
      render: (text) => text || '-',
    },
    {
      title: 'Fecha Nacimiento',
      dataIndex: 'birthDate',
      key: 'birthDate',
      sorter: (a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime(),
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Sexo',
      dataIndex: 'sex',
      key: 'sex',
      render: (sex) => {
        const color = sex === 'male' ? 'blue' : sex === 'female' ? 'pink' : 'default';
        const text = sex === 'male' ? 'Macho' : sex === 'female' ? 'Hembra' : 'Desconocido';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    ...(!loftId
      ? [
          {
            title: 'Palomar',
            dataIndex: 'loftId',
            key: 'loftId',
            render: (loftId: string) => {
              const loft = lofts.find((l) => l._id === loftId);
              return loft?.name || '-';
            },
          },
        ]
      : []),
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />} onClick={() => onSelectPigeon?.(record)}>
            Ver
          </Button>
          <Popconfirm
            title="Eliminar paloma"
            description="¿Estás seguro de eliminar esta paloma?"
            onConfirm={() => handleDelete(record._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderGridView = () => (
    <div className="pigeon-card-grid">
      {filteredPigeons.map((pigeon) => {
        const loft = lofts.find((l) => l._id === pigeon.loftId);
        return (
          <Card
            key={pigeon._id}
            hoverable
            cover={
              pigeon.images?.body ? (
                <img
                  alt={pigeon.name}
                  src={`${import.meta.env.VITE_API_URL}${pigeon.images.body}`}
                  className="pigeon-image-preview"
                />
              ) : (
                <div className="pigeon-image-preview" style={{ background: '#f0f0f0' }} />
              )
            }
            actions={[
              <Button type="link" icon={<EyeOutlined />} onClick={() => onSelectPigeon?.(pigeon)}>
                Ver
              </Button>,
              <Popconfirm
                title="Eliminar paloma"
                description="¿Estás seguro?"
                onConfirm={() => handleDelete(pigeon._id)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Eliminar
                </Button>
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={pigeon.name}
              description={
                <div>
                  <div>{pigeon.ringNumber || 'Sin anilla'}</div>
                  <div>{loft?.name}</div>
                  <Tag color={pigeon.sex === 'male' ? 'blue' : pigeon.sex === 'female' ? 'pink' : 'default'}>
                    {pigeon.sex === 'male' ? 'Macho' : pigeon.sex === 'female' ? 'Hembra' : 'Desconocido'}
                  </Tag>
                </div>
              }
            />
          </Card>
        );
      })}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0 }}>{loftId ? 'Palomas del Palomar' : 'Todas mis Palomas'}</h2>
          </Col>
          <Col>
            <Space>
              <span>Vista:</span>
              <Switch
                checkedChildren={<AppstoreOutlined />}
                unCheckedChildren={<UnorderedListOutlined />}
                checked={viewMode === 'grid'}
                onChange={(checked) => setViewMode(checked ? 'grid' : 'table')}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                Agregar Paloma
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filtros */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por nombre o anilla..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por sexo"
              value={selectedSex}
              onChange={setSelectedSex}
              allowClear
            >
              <Option value="male">Macho</Option>
              <Option value="female">Hembra</Option>
              <Option value="unknown">Desconocido</Option>
            </Select>
          </Col>

          {!loftId && (
            <Col xs={24} sm={12} md={8}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filtrar por palomar"
                value={selectedLofts}
                onChange={setSelectedLofts}
                allowClear
              >
                {lofts.map((loft) => (
                  <Option key={loft._id} value={loft._id}>
                    {loft.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}

          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filtrar por plumaje"
              value={selectedPlumage}
              onChange={setSelectedPlumage}
              allowClear
            >
              {uniquePlumages.map((plumage, index) => (
                <Option key={index} value={plumage as string}>
                  {plumage}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Fecha desde', 'Fecha hasta']}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Padre/Madre asignados"
              value={hasParents}
              onChange={setHasParents}
              allowClear
            >
              <Option value={true}>Con padres</Option>
              <Option value={false}>Sin padres</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Button onClick={clearFilters} block>
              Limpiar Filtros
            </Button>
          </Col>
        </Row>
      </Card>

      {viewMode === 'table' ? (
        <Table
          columns={columns}
          dataSource={filteredPigeons}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} palomas`,
          }}
          locale={{
            emptyText: 'No hay palomas registradas',
          }}
        />
      ) : (
        renderGridView()
      )}

      <PigeonForm
        open={showModal}
        loftId={loftId}
        onSuccess={handleModalSuccess}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
