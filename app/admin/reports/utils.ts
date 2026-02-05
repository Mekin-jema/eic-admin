export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const categoryLabels: Record<string, string> = {
  inv: 'Investor',
  loc: 'Domestic Investor',
  gov: 'Government Official',
  dip: 'Diplomat / Development Partner',
  med: 'Media',
  aca: 'Academia / Research Institution',
  con: 'Business Consultant',
  oth: 'Other',
};

export const sectorLabels: Record<string, string> = {
  agri: 'Agriculture and Agribusiness',
  manu: 'Manufacturing and Industry',
  tech: 'Technology and Innovation',
  energy: 'Energy and Renewable Resources',
  infra: 'Infrastructure and Construction',
  tour: 'Tourism and Hospitality',
  health: 'Healthcare and Pharmaceuticals',
  edu: 'Education and Training',
  fin: 'Finance and Banking',
  mine: 'Mining and Natural Resources',
  prop: 'Real Estate and Property Development',
  logi: 'Transportation and Logistics',
  tele: 'Telecommunications',
};

export const getCategoryLabel = (value?: string | null, otherValue?: string | null) => {
  if (!value) return '—';
  if (value === 'oth' && otherValue) return otherValue;
  return categoryLabels[value] ?? value;
};

export const getSectorLabel = (value?: string | null) => (value ? sectorLabels[value] ?? value : '—');

export const getCountryLabel = (value?: string | null) => {
  if (!value) return '—';
  if (value.length === 2) {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return displayNames.of(value.toUpperCase()) ?? value;
    } catch {
      return value;
    }
  }
  return value;
};

export const downloadCSV = (filename: string, rows: Array<Record<string, string | number | null | undefined>>) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return '';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };
  const csv = [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
};

export const toTitle = (value: string) => value.replace(/\b\w/g, (c) => c.toUpperCase());

export const getNextRunLabel = (schedule: string) => {
  const now = new Date();
  if (schedule === 'daily') {
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    return `${next.toLocaleDateString()} 8:00 AM`;
  }
  if (schedule === 'weekly') {
    const next = new Date(now);
    next.setDate(now.getDate() + 7);
    return `${next.toLocaleDateString()} 9:00 AM`;
  }
  if (schedule === 'monthly') {
    const next = new Date(now);
    next.setMonth(now.getMonth() + 1);
    return `${next.toLocaleDateString()} 9:00 AM`;
  }
  return '—';
};
