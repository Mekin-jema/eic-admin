export const toDisplayDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

export const templateDefaults: Record<string, { subject: string; body: string }> = {
  welcome: {
    subject: 'Welcome to Invest Ethiopia Forum 2026',
    body: `Dear Attendee,

Welcome to the Invest Ethiopia Forum 2026! We're excited to have you join us for this premier investment event.

Important Details:
• Date: May 12-13, 2026
• Venue: Ethiopian Skylight Hotel, Addis Ababa
• Check-in: Starts at 8:00 AM

Please bring your registration confirmation and ID.

Best regards,
Invest Ethiopia Forum Team`,
  },
  'checkin-reminder': {
    subject: 'Important: Check-in Information',
    body: `Dear Attendee,

This is a friendly reminder about check-in for Invest Ethiopia Forum 2026.

Check-in Details:
• Date: May 12-13, 2026
• Time: 8:00 AM – 10:30 AM
• Venue: Ethiopian Skylight Hotel, Addis Ababa

Please bring your registration confirmation and a valid ID for quick entry.

We look forward to welcoming you.

Best regards,
Invest Ethiopia Forum Team`,
  },
  'vip-invite': {
    subject: 'Exclusive VIP Event Invitation',
    body: `Dear Esteemed Guest,

You are cordially invited to the Invest Ethiopia Forum 2026 VIP experience.

VIP Access Includes:
• Priority check-in and seating
• Private networking lounge
• Exclusive meetings with key stakeholders

Please confirm your attendance so we can reserve your VIP access.

Warm regards,
Invest Ethiopia Forum Team`,
  },
  'post-event': {
    subject: 'Thank You & Next Steps',
    body: `Dear Attendee,

Thank you for attending Invest Ethiopia Forum 2026. We appreciate your participation and engagement.

Next Steps:
• You will receive a summary of key sessions and materials shortly.
• For follow-ups, please reply with any questions or partnership interests.

We look forward to staying connected.

Best regards,
Invest Ethiopia Forum Team`,
  },
};

export const getTemplateDefaults = (key: string) => templateDefaults[key] || templateDefaults.welcome;

export const mergeTags = [
  { label: 'First Name', value: '{{firstName}}' },
  { label: 'Last Name', value: '{{lastName}}' },
  { label: 'Full Name', value: '{{fullName}}' },
  { label: 'Organization', value: '{{organization}}' },
  { label: 'Email', value: '{{email}}' },
  { label: 'Event Name', value: '{{eventName}}' },
];

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const renderPreviewHtml = (content: string) => {
  const safe = escapeHtml(content).replace(/\n/g, '<br />');
  return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
    <div style="font-size:18px;font-weight:700;">Ethiopian Investment Commission</div>
    <div style="font-size:12px;opacity:.8;margin-top:4px;">Invest Ethiopia Forum</div>
  </div>
  <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:0;padding:24px;line-height:1.7;">
    ${safe}
  </div>
  <div style="background:#f1f5f9;padding:16px 24px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;font-size:12px;color:#475569;text-align:center;">
    © 2026 Ethiopian Investment Commission. All rights reserved.<br />
    <a href="https://eic-frontend.vercel.app/privacy" style="color:#0f172a;text-decoration:none;">Privacy Policy</a> | 
    <a href="https://eic-frontend.vercel.app/terms" style="color:#0f172a;text-decoration:none;">Terms of Service</a>
  </div>
</div>`;
};
