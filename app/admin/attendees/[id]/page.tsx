import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getAttendeeById } from '@/lib/adminApi';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format as timeagoFormat } from 'timeago.js';
import {
  Calendar,
  User,
  FileText,
  Building,
  Phone,
  Globe,
  Briefcase,
  Mail,
  Hash,
  FileUp,
  MapPin,
  Settings,
  Activity,
  CheckCircle,
  Clock,
  Download,
  Edit,
  ArrowLeft,
  ExternalLink,
  Shield,
  CreditCard,
  Users,
  Tag
} from 'lucide-react';

export const dynamic = 'force-dynamic';

type FieldConfigItem = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  format?: 'date' | 'currency' | ((val: any) => string);
  variant?: 'muted' | 'default' | 'destructive';
};

const FIELD_CONFIG = {
  profile: [
    { key: 'id', label: 'Attendee ID', icon: Hash, variant: 'muted' },
    { key: 'fullName', label: 'Full Name', icon: User },
    { key: 'email', label: 'Email Address', icon: Mail },
    { key: 'phoneNumber', label: 'Phone Number', icon: Phone },
    { key: 'organization', label: 'Organization', icon: Building },
    { key: 'jobTitle', label: 'Job Title', icon: Briefcase },
    { key: 'country', label: 'Country', icon: Globe, format: (val: string) => getCountryLabel(val) },
    
  ],
  registration: [
    { key: 'category', label: 'Category', icon: Tag, format: (val: string) => getCategoryLabel(val) },
    { key: 'day1Attendance', label: 'Day 1 Attendance', icon: Users, format: (val: string) => getDayAttendanceLabel(val) },
    { key: 'day1Sessions', label: 'Day 1 Sessions', icon: Users, format: (val: string[]) => getSessionListLabel(val, day1SessionLabels) },
    { key: 'day2Attendance', label: 'Day 2 Attendance', icon: Users, format: (val: string) => getDayAttendanceLabel(val) },
    { key: 'day2Sessions', label: 'Day 2 Sessions', icon: Users, format: (val: string[]) => getSessionListLabel(val, day2SessionLabels) },
    { key: 'sectorInterest', label: 'Sector Interest', icon: Building, format: (val: string) => getSectorLabel(val) },
    { key: 'communicationPreference', label: 'Communication Preference', icon: Mail },
  ],
  company: [
    { key: 'hasExistingCompany', label: 'Has Existing Company', icon: Building, 
      format: (val: boolean) => val ? 'Yes' : 'No' },
    { key: 'companyName', label: 'Company Name', icon: Building },
    { key: 'companySector', label: 'Company Sector', icon: Settings },
  ],
  preferences: [
    { key: 'isCheckedIn', label: 'Checked In Status', icon: CheckCircle, 
      format: (val: boolean) => val ? 'Checked In' : 'Not Checked In',
      variant: (val: boolean) => val ? 'default' : 'secondary' },
    { key: 'needsVisa', label: 'Visa Requirement', icon: Shield, 
      format: (val: boolean) => val ? 'Required' : 'Not Required' },
    { key: 'siteVisit', label: 'Site Visit', icon: MapPin, 
      format: (val: boolean) => val ? 'Registered' : 'Not Registered' },
    { key: 'specialRequirements', label: 'Special Requirements', icon: Settings },
  ],
  tracking: [
    { key: 'scanCount', label: 'Total Scans', icon: Activity },
    { key: 'createdAt', label: 'Registration Date', icon: Calendar, format: 'date' },
    { key: 'updatedAt', label: 'Last Updated', icon: Calendar, format: 'date' },
  ],
  files: [
    { key: 'businessLicenseUrl', label: 'Business License', icon: FileText },
    { key: 'passportCopyUrl', label: 'Passport Copy', icon: CreditCard },
  ],
};

const categoryLabels: Record<string, string> = {
  inv: 'International Investor',
  loc: 'Domestic Investor',
  gov: 'Government Official',
  dip: 'Diplomat / Development Partner',
  med: 'Media',
  aca: 'Academia / Research Institution',
  con: 'Business Consultant',
  oth: 'Other',
};

const sectorLabels: Record<string, string> = {
  agri: 'Agriculture and Agribusiness',
  manu: 'Manufacturing and Industry',
  tech: 'Technology and Innovation',
  energy: 'Energy and Renewable Resources',
  infra: 'Infrastructure and Construction',
  tour: 'Tourism and Hospitality',
  health: 'Healthcare and Pharmaceuticals',
  fin: 'Finance and Banking',
  mine: 'Mining and Natural Resources',
  prop: 'Real Estate and Property Development',
  logi: 'Transportation and Logistics',
  tele: 'Telecommunications',
};

const dayAttendanceLabels: Record<string, string> = {
  full: 'Full Day',
  partial: 'Partial',
  no: 'No',
};

const day1SessionLabels: Record<string, string> = {
  'day1-panel-1': 'High-Level Panel 1: Ethiopia’s Economic Direction & Reform Commitments',
  'day1-breakout-1': 'Breakout Session 1: Manufacturing – Scaling Industrial Competitiveness',
  'day1-breakout-2': 'Breakout Session 2: Mining, Energy & Energy Transition',
  'day1-breakout-3': 'Breakout Session 3: NDCs & COP Hosting – Climate Commitment as an Investment Opportunity',
  'day1-matchmaking': 'Matchmaking Session',
};

const day2SessionLabels: Record<string, string> = {
  'day2-panel-2': 'High-Level Panel 2: Growing in Ethiopia',
  'day2-breakout-4': 'Breakout 4: Agriculture & Agro-Processing – From Farm to Market',
  'day2-breakout-5': 'Breakout 5: Special Economic Zones as Engines of Investment',
  'day2-breakout-6': 'Breakout 6: Financing Growth – Banking, Capital Markets & Investment Enablement',
};

const getCategoryLabel = (value?: string | null) => (value ? categoryLabels[value] ?? value : '—');
const getSectorLabel = (value?: string | null) => (value ? sectorLabels[value] ?? value : '—');
const getDayAttendanceLabel = (value?: string | null) => (value ? dayAttendanceLabels[value] ?? value : '—');
const getSessionListLabel = (sessions?: string[] | null, labelMap?: Record<string, string>) => {
  if (!sessions?.length) return '—';
  return sessions.map((item) => labelMap?.[item] ?? item).join(', ');
};

const getCountryLabel = (value?: string | null) => {
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

const formatDateTime = (value: any) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return (
    <div className="flex flex-col">
      <span>{date.toLocaleDateString()}</span>
      <span className="text-xs text-muted-foreground">
        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

const formatValue = (value: any, format?: string | Function) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">—</span>;
  }
  
  if (typeof format === 'function') return format(value);
  
  if (format === 'date') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return (
      <div className="flex flex-col">
        <span>{date.toLocaleDateString()}</span>
        <span className="text-xs text-muted-foreground">
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {timeagoFormat(date)}
        </span>
      </div>
    );
  }
  
  return value;
};

const DetailCard = ({ 
  title, 
  description,
  children, 
  icon: Icon,
  className = ''
}: { 
  title: string; 
  description?: string;
  children: React.ReactNode; 
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const DetailItem = ({ 
  label, 
  value,
  icon: Icon,
  variant = 'default'
}: { 
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'muted' | 'highlight';
}) => (
  <div className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={`text-sm ${
        variant === 'muted' ? 'text-muted-foreground' : 
        variant === 'highlight' ? 'text-primary font-medium' : 
        'text-foreground'
      }`}>
        {label}
      </span>
    </div>
    <div className="text-right max-w-[60%]">
      {typeof value === 'string' || typeof value === 'number' ? (
        <span className="font-medium text-foreground">{value}</span>
      ) : (
        value
      )}
    </div>
  </div>
);

const StatusBadge = ({ 
  status, 
  variant = 'default' 
}: { 
  status: string; 
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning';
}) => {
  const variantMap = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input bg-background',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantMap[variant]}`}>
      {status}
    </span>
  );
};

const FileCard = ({ 
  label, 
  url, 
  icon: Icon,
  size,
  type
}: { 
  label: string; 
  url?: string; 
  icon?: any;
  size?: string;
  type?: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{label}</p>
        {size && type && (
          <p className="text-xs text-muted-foreground">
            {type} • {size}
          </p>
        )}
      </div>
    </div>
    {url ? (
      <Button variant="ghost" size="sm" asChild>
        <Link href={url} target="_blank" rel="noreferrer">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Link>
      </Button>
    ) : (
      <span className="text-sm text-muted-foreground">Not uploaded</span>
    )}
  </div>
);

const ActionButton = ({ 
  children, 
  icon: Icon, 
  variant = 'outline',
  href,
  ...props 
}: Omit<React.ComponentProps<typeof Button>, 'asChild'> & { 
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
}) => (
  <Button variant={variant} className="gap-2" asChild {...props}>
    <Link href={href}>
      <span className="inline-flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </span>
    </Link>
  </Button>
);

export default async function AttendeeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    const attendee = await getAttendeeById(id, token);
    
    if (!attendee) return notFound();
    
    const legacyAttendance = attendee.attendance ?? null;
    const derivedDay1Attendance = attendee.day1Attendance
      ?? (legacyAttendance === 'day1' || legacyAttendance === 'both' ? 'full'
        : legacyAttendance === 'day2' ? 'no' : undefined);
    const derivedDay2Attendance = attendee.day2Attendance
      ?? (legacyAttendance === 'day2' || legacyAttendance === 'both' ? 'full'
        : legacyAttendance === 'day1' ? 'no' : undefined);

    const displayData = {
      ...attendee,
      fullName: `${attendee.firstName} ${attendee.lastName}`.trim(),
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="container mx-auto px-4 py-6 space-y-6 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/admin/attendees">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendee Details</h1>
              <p className="text-sm text-muted-foreground">Manage and view attendee information</p>
            </div>
          </div>

          {/* Profile Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-2 border-background shadow-lg">
                    <AvatarFallback className="text-lg bg-primary/10">
                      {getInitials(displayData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{displayData.fullName}</h2>
                      <StatusBadge 
                        status={attendee.isCheckedIn ? "Checked In" : "Not Checked In"} 
                        variant={attendee.isCheckedIn ? "success" : "secondary"}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {attendee.jobTitle} • {attendee.organization}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {attendee.email}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {getCountryLabel(attendee.country)}
                      </p>
                    </div>
                  </div>
                </div>
      
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 lg:w-auto">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="preferences">Event Preferences</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
          
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
                <DetailCard 
                  title="Personal Information" 
                  icon={User}
                  description="Basic contact and personal details"
                >
                  <div className="space-y-1">
                    {FIELD_CONFIG.profile.map(({ key, label, icon: Icon }) => (
                      <DetailItem
                        key={key}
                        label={label}
                        value={formatValue(displayData[key])}
                        icon={Icon}
                      />
                    ))}
                  </div>
                </DetailCard>

            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <DetailCard 
                title="Company Information" 
                icon={Building}
                description="Business and company details"
              >
                <div className="space-y-1">
                  {FIELD_CONFIG.company.map(({ key, label, icon: Icon, format }) => (
                    <DetailItem
                      key={key}
                      label={label}
                      value={formatValue(displayData[key], format)}
                      icon={Icon}
                      variant={key === 'hasExistingCompany' ? 'highlight' : 'default'}
                    />
                  ))}
                </div>
              </DetailCard>
            </TabsContent>

            <TabsContent value="registration" className="space-y-6">
                <DetailCard 
                  title="Registration Details" 
                  icon={Settings}
                  description="Event registration and preferences"
                >
                  <div className="space-y-1">
                    {FIELD_CONFIG.registration.map(({ key, label, icon: Icon }) => (
                      <DetailItem
                        key={key}
                        label={label}
                        value={formatValue(displayData[key])}
                        icon={Icon}
                      />
                    ))}
                  </div>
                </DetailCard>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <DetailCard 
                title="Event Preferences" 
                icon={CheckCircle}
                description="Special requirements and preferences"
              >
                <div className="space-y-1">
                  {FIELD_CONFIG.preferences.map(({ key, label, icon: Icon, format }) => (
                    <DetailItem
                      key={key}
                      label={label}
                      value={formatValue(displayData[key], format)}
                      icon={Icon}
                    />
                  ))}
                </div>
              </DetailCard>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
                <DetailCard 
                  title="Activity Tracking" 
                  icon={Activity}
                  description="Check-in history and event activity"
                >
                  <div className="space-y-1">
                    {FIELD_CONFIG.tracking.map(({ key, label, icon: Icon, format }) => (
                      <DetailItem
                        key={key}
                        label={label}
                        value={formatValue(displayData[key], format)}
                        icon={Icon}
                      />
                    ))}
                  </div>
                </DetailCard>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <DetailCard 
                title="Documents" 
                icon={FileText}
                description="Uploaded files and documents"
              >
                <div className="space-y-3">
                  {FIELD_CONFIG.files.map((file) => (
                    <FileCard
                      key={file.key}
                      label={file.label}
                      url={displayData[file.key]}
                      icon={file.icon}
                    />
                  ))}
                </div>
              </DetailCard>
            </TabsContent>

        

            <TabsContent value="system" className="space-y-6">
              <DetailCard 
                title="System Information" 
                icon={Settings}
                description="Technical and system details"
                className="bg-muted/50"
              >
                <div className="space-y-1">
                  <DetailItem
                    label="Attendee ID"
                    value={attendee.id}
                    variant="muted"
                  />
                  <DetailItem
                    label="Record Created"
                    value={formatValue(attendee.createdAt, 'date')}
                    variant="muted"
                  />
                  <DetailItem
                    label="Last Updated"
                    value={formatValue(attendee.updatedAt, 'date')}
                    variant="muted"
                  />
                </div>
              </DetailCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}