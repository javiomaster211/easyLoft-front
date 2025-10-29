import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  EyeOutlined,
  ImportOutlined,
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  AppleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '../stores/authStore';
import { Dashboard } from './Dashboard';
import { LoftList } from './LoftList';
import { LoftForm } from './LoftForm';
import { PigeonTable } from './PigeonTable';
import { PigeonForm } from './PigeonForm';
import { PigeonDetail } from './PigeonDetail';
import { ImportData } from './ImportData';
import { Pigeon, Loft } from '../types';

const { Header, Content, Footer, Sider } = Layout;

export function MainLayout() {
  const { user, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedLoft, setSelectedLoft] = useState<Loft | null>(null);
  const [selectedPigeon, setSelectedPigeon] = useState<Pigeon | null>(null);
  const [showLoftForm, setShowLoftForm] = useState(false);
  const [showPigeonForm, setShowPigeonForm] = useState(false);
  const [editingLoft, setEditingLoft] = useState<Loft | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedLoft(null);
    setSelectedPigeon(null);
    setShowLoftForm(false);
    setShowPigeonForm(false);
    setEditingLoft(null);
  };

  const handleSelectLoft = (loftId: string) => {
    // En una aplicación real, buscaríamos el loft por ID
    setCurrentView('pigeons-by-loft');
    // setSelectedLoft(loft); // Necesitaríamos obtener el loft completo
  };

  const handleSelectPigeon = (pigeon: Pigeon) => {
    setSelectedPigeon(pigeon);
    setCurrentView('pigeon-detail');
  };

  const renderContent = () => {
    // Formularios
    if (showLoftForm) {
      return (
        <LoftForm
          loft={editingLoft || undefined}
          onSuccess={() => {
            setShowLoftForm(false);
            setEditingLoft(null);
          }}
          onCancel={() => {
            setShowLoftForm(false);
            setEditingLoft(null);
          }}
        />
      );
    }

    if (showPigeonForm) {
      return (
        <PigeonForm
          loftId={selectedLoft?._id}
          onSuccess={() => setShowPigeonForm(false)}
          onCancel={() => setShowPigeonForm(false)}
        />
      );
    }

    // Vistas principales
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'lofts':
        return (
          <LoftList
            onSelectLoft={handleSelectLoft}
          />
        );
      
      case 'pigeons':
        return (
          <PigeonTable
            onSelectPigeon={handleSelectPigeon}
            onCreatePigeon={() => setShowPigeonForm(true)}
          />
        );
      
      case 'pigeons-by-loft':
        return (
          <PigeonTable
            loftId={selectedLoft?._id}
            onSelectPigeon={handleSelectPigeon}
            onCreatePigeon={() => setShowPigeonForm(true)}
          />
        );
      
      case 'pigeon-detail':
        return selectedPigeon ? (
          <PigeonDetail
            pigeon={selectedPigeon}
            onBack={() => setCurrentView('pigeons')}
          />
        ) : (
          <div>Paloma no encontrada</div>
        );
      
      case 'import':
        return <ImportData />;
      
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Configurar el menú del usuario
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: logout,
    },
  ];

  // Configurar items del menú lateral
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'lofts',
      icon: <HomeOutlined />,
      label: 'Palomares',
    },
    {
      key: 'pigeons',
      icon: <EyeOutlined />,
      label: 'Palomas',
    },
    {
      key: 'import',
      icon: <ImportOutlined />,
      label: 'Importar',
    },
    {
      type: 'divider',
    },
    {
      key: 'medications',
      icon: <MedicineBoxOutlined />,
      label: 'Medicamentos',
      disabled: true, // Por implementar
    },
    {
      key: 'diets',
      icon: <AppleOutlined />,
      label: 'Dietas',
      disabled: true, // Por implementar
    },
    {
      key: 'tournaments',
      icon: <TrophyOutlined />,
      label: 'Torneos',
      disabled: true, // Por implementar
    },
    {
      key: 'trainings',
      icon: <ThunderboltOutlined />,
      label: 'Entrenamientos',
      disabled: true, // Por implementar
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    handleNavigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          🕊️ EasyLoft
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentView]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: 0, color: '#001529' }}>
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'lofts' && 'Palomares'}
            {currentView === 'pigeons' && 'Palomas'}
            {currentView === 'pigeons-by-loft' && 'Palomas del Palomar'}
            {currentView === 'pigeon-detail' && 'Detalle de Paloma'}
            {currentView === 'import' && 'Importar Datos'}
          </h2>
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name}</span>
            </Space>
          </Dropdown>
        </Header>
        
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: '#fff',
            borderRadius: 8,
          }}>
            {renderContent()}
          </div>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          EasyLoft © {new Date().getFullYear()} - Sistema de Gestión de Palomares
        </Footer>
      </Layout>
    </Layout>
  );
}
