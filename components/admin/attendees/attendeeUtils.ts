import type { AttendeeRegistration } from '@/lib/adminApi';

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

export const attendanceLabels: Record<string, string> = {
  day1: 'Day 1',
  day2: 'Day 2',
  both: 'Both Days',
};

export const dayAttendanceLabels: Record<string, string> = {
  full: 'Full Day',
  partial: 'Partial',
  no: 'No',
};

export const day1SessionLabels: Record<string, string> = {
  'day1-panel-1': 'High-Level Panel 1: Ethiopia’s Economic Direction & Reform Commitments',
  'day1-breakout-1': 'Breakout Session 1: Manufacturing – Scaling Industrial Competitiveness',
  'day1-breakout-2': 'Breakout Session 2: Mining, Energy & Energy Transition',
  'day1-breakout-3': 'Breakout Session 3: NDCs & COP Hosting – Climate Commitment as an Investment Opportunity',
  'day1-matchmaking': 'Matchmaking Session',
};

export const day2SessionLabels: Record<string, string> = {
  'day2-panel-2': 'High-Level Panel 2: Growing in Ethiopia',
  'day2-breakout-4': 'Breakout 4: Agriculture & Agro-Processing – From Farm to Market',
  'day2-breakout-5': 'Breakout 5: Special Economic Zones as Engines of Investment',
  'day2-breakout-6': 'Breakout 6: Financing Growth – Banking, Capital Markets & Investment Enablement',
};

export const getCategoryLabel = (value?: string | null, otherValue?: string | null) => {
  if (!value) return '—';
  if (value === 'oth' && otherValue) return otherValue;
  return categoryLabels[value] ?? value;
};

export const getAttendanceLabel = (value?: string | null) => (value ? attendanceLabels[value] ?? value : '—');

export const getDayAttendanceLabel = (value?: string | null) => (value ? dayAttendanceLabels[value] ?? value : '—');

export const getSessionListLabel = (sessions?: string[] | null, labelMap?: Record<string, string>) => {
  if (!sessions?.length) return '';
  return sessions.map((item) => labelMap?.[item] ?? item).join(', ');
};

export const getAttendanceSummary = (attendee: AttendeeRegistration) => {
  const parts: string[] = [];
  if (attendee.day1Attendance) {
    let label = `Day 1: ${getDayAttendanceLabel(attendee.day1Attendance)}`;
    if (attendee.day1Attendance === 'partial') {
      const sessions = getSessionListLabel(attendee.day1Sessions, day1SessionLabels);
      if (sessions) label += ` (${sessions})`;
    }
    parts.push(label);
  }
  if (attendee.day2Attendance) {
    let label = `Day 2: ${getDayAttendanceLabel(attendee.day2Attendance)}`;
    if (attendee.day2Attendance === 'partial') {
      const sessions = getSessionListLabel(attendee.day2Sessions, day2SessionLabels);
      if (sessions) label += ` (${sessions})`;
    }
    parts.push(label);
  }
  if (parts.length) return parts.join(' • ');
  return getAttendanceLabel(attendee.attendance);
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

export const yesNo = (value?: boolean | null) => (value ? 'Yes' : 'No');
