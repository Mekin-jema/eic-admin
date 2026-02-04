'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { AttendeeRegistration } from '@/lib/adminApi';
import {
  getAttendanceSummary,
  getCategoryLabel,
  getCountryLabel,
  getSectorLabel,
  yesNo,
} from './attendeeUtils';

interface AttendeeDetailsDialogProps {
  open: boolean;
  attendee: AttendeeRegistration | null;
  onOpenChange: (open: boolean) => void;
  toFileUrl: (path?: string | null) => string | null;
}

export default function AttendeeDetailsDialog({
  open,
  attendee,
  onOpenChange,
  toFileUrl,
}: AttendeeDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
        </DialogHeader>
        {attendee ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Full Name</div>
                <div className="font-medium">
                  {attendee.firstName} {attendee.lastName}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Email</div>
                <div className="font-medium">{attendee.email}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Phone</div>
                <div className="font-medium">{attendee.phoneNumber}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Country</div>
                <div className="font-medium">{getCountryLabel(attendee.country)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Organization</div>
                <div className="font-medium">{attendee.organization || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Job Title</div>
                <div className="font-medium">{attendee.jobTitle || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Category</div>
                <div className="font-medium">
                  {getCategoryLabel(attendee.category, attendee.otherCategory)}
                </div>
              </div>
              {attendee.category === 'oth' && (
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Other Category</div>
                  <div className="font-medium">{attendee.otherCategory || '—'}</div>
                </div>
              )}
              <div>
                <div className="text-xs uppercase text-muted-foreground">Sector Interest</div>
                <div className="font-medium">{getSectorLabel(attendee.sectorInterest)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Attendance</div>
                <div className="font-medium">{getAttendanceSummary(attendee)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Communication Preference</div>
                <div className="font-medium">{attendee.communicationPreference || '—'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Has Existing Company</div>
                <div className="font-medium">{yesNo(attendee.hasExistingCompany)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Company Name</div>
                <div className="font-medium">{attendee.companyName || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Company Sector</div>
                <div className="font-medium">{attendee.companySector || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Business License</div>
                {toFileUrl(attendee.businessLicenseUrl) ? (
                  <a
                    href={toFileUrl(attendee.businessLicenseUrl) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline"
                  >
                    View File
                  </a>
                ) : (
                  <div className="font-medium">—</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Needs Visa</div>
                <div className="font-medium">{yesNo(attendee.needsVisa)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Site Visit</div>
                <div className="font-medium">{yesNo(attendee.siteVisit)}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Special Requirements</div>
                <div className="font-medium">{attendee.specialRequirements || '—'}</div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
