import moment from 'moment';
moment.locale('es');

import Pagination from 'rc-pagination/lib/locale/en_US';
import DatePicker from 'antd/lib/date-picker/locale/en_US';
import TimePicker from 'antd/lib/time-picker/locale/en_US';
import Calendar from 'antd/lib/calendar/locale/en_US';

export default {
  locale: 'es',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Filtrar Menu',
    filterConfirm: 'OK',
    filterReset: 'Resetear',
    emptyText: 'No Hay Datos',
    selectAll: 'Select All',
    selectInvert: 'Select Invert'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancelar',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancelar'
  },
  Transfer: {
    notFoundContent: 'No Encontrado',
    searchPlaceholder: 'Buscar Aquí',
    itemUnit: 'item',
    itemsUnit: 'items'
  },
  Select: {
    notFoundContent: 'Not Found'
  },
  Upload: {
    uploading: 'Uploading...',
    removeFile: 'Remove file',
    uploadError: 'Upload error',
    previewFile: 'Preview file'
  }
};
