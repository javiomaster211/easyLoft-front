import type { ThemeConfig } from 'antd';

// Theme personalizado para EasyLoft - Colombicultura
export const antdTheme: ThemeConfig = {
  token: {
    // Colores principales - Inspirados en palomas
    colorPrimary: '#1890ff', // Azul cielo
    colorSuccess: '#52c41a', // Verde
    colorWarning: '#faad14', // Amarillo/Dorado
    colorError: '#ff4d4f', // Rojo
    colorInfo: '#1890ff',
    
    // Tipografía
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Espaciado
    borderRadius: 6,
    
    // Layout
    colorBgLayout: '#f0f2f5',
    colorBgContainer: '#ffffff',
  },
  
  components: {
    Layout: {
      headerBg: '#001529',
      headerColor: '#ffffff',
      headerHeight: 64,
      siderBg: '#001529',
    },
    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#1890ff',
    },
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Table: {
      headerBg: '#fafafa',
      borderColor: '#f0f0f0',
    },
    Card: {
      borderRadius: 8,
    },
  },
};

// Configuración de locale español
export const esES_locale = {
  locale: 'es',
  Pagination: {
    items_per_page: '/ página',
    jump_to: 'Ir a',
    jump_to_confirm: 'confirmar',
    page: 'Página',
    prev_page: 'Página anterior',
    next_page: 'Página siguiente',
    prev_5: '5 páginas previas',
    next_5: '5 páginas siguientes',
    prev_3: '3 páginas previas',
    next_3: '3 páginas siguientes',
  },
  DatePicker: {
    lang: {
      locale: 'es_ES',
      placeholder: 'Seleccionar fecha',
      rangePlaceholder: ['Fecha inicial', 'Fecha final'],
      today: 'Hoy',
      now: 'Ahora',
      backToToday: 'Volver a hoy',
      ok: 'Aceptar',
      clear: 'Limpiar',
      month: 'Mes',
      year: 'Año',
      timeSelect: 'Seleccionar hora',
      dateSelect: 'Seleccionar fecha',
      monthSelect: 'Elegir un mes',
      yearSelect: 'Elegir un año',
      decadeSelect: 'Elegir una década',
      yearFormat: 'YYYY',
      dateFormat: 'DD/MM/YYYY',
      dayFormat: 'D',
      dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
      monthFormat: 'MMMM',
      monthBeforeYear: true,
      previousMonth: 'Mes anterior (PageUp)',
      nextMonth: 'Mes siguiente (PageDown)',
      previousYear: 'Año anterior (Control + left)',
      nextYear: 'Año siguiente (Control + right)',
      previousDecade: 'Década anterior',
      nextDecade: 'Década siguiente',
      previousCentury: 'Siglo anterior',
      nextCentury: 'Siglo siguiente',
    },
    timePickerLocale: {
      placeholder: 'Seleccionar hora',
    },
  },
  Table: {
    filterTitle: 'Filtrar menú',
    filterConfirm: 'Aceptar',
    filterReset: 'Reiniciar',
    selectAll: 'Seleccionar todo',
    selectInvert: 'Invertir selección',
    sortTitle: 'Ordenar',
    expand: 'Expandir fila',
    collapse: 'Colapsar fila',
    triggerDesc: 'Ordenar descendente',
    triggerAsc: 'Ordenar ascendente',
    cancelSort: 'Cancelar ordenación',
  },
  Modal: {
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    justOkText: 'Aceptar',
  },
  Popconfirm: {
    okText: 'Aceptar',
    cancelText: 'Cancelar',
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Buscar aquí',
    itemUnit: 'elemento',
    itemsUnit: 'elementos',
  },
  Upload: {
    uploading: 'Subiendo...',
    removeFile: 'Eliminar archivo',
    uploadError: 'Error al subir',
    previewFile: 'Vista previa',
    downloadFile: 'Descargar archivo',
  },
  Empty: {
    description: 'Sin datos',
  },
};

