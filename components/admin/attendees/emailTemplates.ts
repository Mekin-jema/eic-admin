import type { AttendeeRegistration } from '@/lib/adminApi';

export const buildVerificationEmailHtml = (attendee: AttendeeRegistration, badgeUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Verified | Ethiopian Investment Commission</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #071910 0%, #0d261a 100%);
      color: #ffffff;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .hero-section {
        padding: 32px 24px !important;
      }
      .badge-card {
        padding: 20px !important;
      }
      .info-grid {
        grid-template-columns: 1fr !important;
      }
      .header-logo {
        width: 180px !important;
      }
      .button-container {
        flex-direction: column !important;
      }
      .button {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #071910 0%, #0d261a 100%); padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" class="container" style="background: #0d261a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); margin: 0 auto; border: 1px solid #1e462f;">
          
          <!-- Gold Top Banner -->
          <tr>
            <td style="background: linear-gradient(90deg, #d7b15a 0%, #c19a4a 100%); height: 8px;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://eic-frontend.vercel.app/_next/image?url=%2FEIC.png&w=256&q=75" alt="Ethiopian Investment Commission" class="header-logo" style="height: 48px; width: auto; filter: brightness(0) invert(1);">
                  </td>
                  <td align="right" style="color: #a7f3d0; font-size: 14px; font-weight: 500;">
                    Official Verification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="hero-section" style="padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, rgba(215, 177, 90, 0.1) 0%, rgba(215, 177, 90, 0.05) 100%);">
              <div style="display: inline-block; background: linear-gradient(135deg, #d7b15a 0%, #c19a4a 100%); padding: 20px; border-radius: 50%; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(215, 177, 90, 0.3);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <circle cx="12" cy="12" r="12" fill="white"/>
                  <path d="M7 12L10 15L17 8" stroke="#d7b15a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Registration Successfully Verified
              </h1>
              <p style="margin: 0; font-size: 18px; color: #a7f3d0; line-height: 1.5; font-weight: 400;">
                Your credentials have been approved for Ethiopia Investment Conference
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #a7f3d0; line-height: 1.6;">
                Dear <strong style="color: #ffffff;">${attendee.firstName} ${attendee.lastName}</strong>,
                <br><br>
                Congratulations! Your registration for the <strong>Ethiopia Investment Conference 2024</strong> has been thoroughly reviewed and validated. We are pleased to inform you that all submitted documents meet our requirements.
              </p>

              <!-- Status Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(215, 177, 90, 0.1); border: 2px solid #d7b15a; border-radius: 16px; padding: 24px; margin: 32px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="60" style="padding-right: 20px;">
                          <div style="background: linear-gradient(135deg, #d7b15a 0%, #c19a4a 100%); border-radius: 12px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </td>
                        <td>
                          <h3 style="margin: 0 0 8px; font-size: 20px; color: #ffffff; font-weight: 600;">
                            STATUS: <span style="color: #d7b15a; font-weight: 700;">APPROVED ✓</span>
                          </h3>
                          <p style="margin: 0; font-size: 15px; color: #a7f3d0;">
                            All documents verified and validated for event participation
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Verified Information Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #113a27; border-radius: 16px; padding: 32px; margin: 32px 0; border: 1px solid #1e462f;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 28px; font-size: 22px; font-weight: 600; color: #d7b15a; text-align: center;">
                      VERIFIED ATTENDEE INFORMATION
                    </h2>
                    
                    <!-- Information Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0 16px;">
                      <tr>
                        <td width="50%" style="padding: 0 8px 0 0;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Full Name
                            </div>
                            <div style="color: #ffffff; font-size: 18px; font-weight: 600;">
                              ${attendee.firstName} ${attendee.lastName}
                            </div>
                          </div>
                        </td>
                        <td width="50%" style="padding: 0 0 0 8px;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Attendee ID
                            </div>
                            <div style="color: #d7b15a; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">
                              ${attendee.id}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding: 0 8px 0 0;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Email Address
                            </div>
                            <div style="color: #ffffff; font-size: 16px; font-weight: 500;">
                              ${attendee.email}
                            </div>
                          </div>
                        </td>
                        <td width="50%" style="padding: 0 0 0 8px;">
                          <div style="background: #0d261a; border-radius: 12px; padding: 20px; border: 1px solid #1e462f;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                              Organization
                            </div>
                            <div style="color: #ffffff; font-size: 16px; font-weight: 500;">
                              ${attendee.organization || '—'}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div style="background: rgba(215, 177, 90, 0.1); border-radius: 12px; padding: 20px; border: 1px solid #d7b15a;">
                            <div style="color: #a7f3d0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                              Verification Summary
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                              <div style="background: #10b981; width: 10px; height: 10px; border-radius: 50%;"></div>
                              <span style="color: #10b981; font-size: 16px; font-weight: 600;">
                                ✓ Identity Documents: Verified
                              </span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                              <div style="background: #10b981; width: 10px; height: 10px; border-radius: 50%;"></div>
                              <span style="color: #10b981; font-size: 16px; font-weight: 600;">
                                ✓ Registration Details: Approved
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 20px; font-size: 18px; color: #d7b15a; font-weight: 600;">
                      Your digital access badge is ready for download
                    </p>
                    <table class="button-container" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td>
                          <a href="${badgeUrl}" style="display: inline-block; background: linear-gradient(90deg, #d7b15a 0%, #c19a4a 100%); color: #0d261a; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 24px rgba(215, 177, 90, 0.4); transition: all 0.3s ease; margin: 0 8px 8px 0;">
                            Download Digital Badge
                          </a>
                          <a href="https://eic-frontend.vercel.app/dashboard" style="display: inline-block; background: transparent; color: #d7b15a; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; border: 2px solid #d7b15a; transition: all 0.3s ease; margin: 0 0 8px 8px;">
                            Access Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important Instructions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 28px; margin: 32px 0; border: 1px solid #1e462f;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px; font-size: 18px; color: #d7b15a; font-weight: 600; text-align: center;">
                      📋 Event Participation Instructions
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">1</div>
                        </td>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Download and print</strong> your digital badge before arrival
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">2</div>
                        </td>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Arrive 45 minutes early</strong> for security and check-in procedures
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right: 12px;">
                          <div style="background: #d7b15a; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #0d261a; font-weight: 700; font-size: 14px;">3</div>
                        </td>
                        <td>
                          <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                            <strong>Bring valid ID</strong> matching your registration details
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Contact Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(215, 177, 90, 0.1); border-radius: 12px; padding: 24px; margin: 32px 0;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 16px; font-size: 16px; color: #d7b15a; font-weight: 600; text-align: center;">
                      Need Assistance?
                    </h4>
                    <p style="margin: 0; font-size: 14px; color: #a7f3d0; line-height: 1.6; text-align: center;">
                      Contact our support team at 
                      <a href="mailto:support@eic.gov.et" style="color: #d7b15a; text-decoration: none; font-weight: 600;">support@eic.gov.et</a>
                      <br>
                      or call <a href="tel:+251115510033" style="color: #d7b15a; text-decoration: none; font-weight: 600;">(+251) 11 551 0033</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #86efac; line-height: 1.6; text-align: center;">
                We look forward to welcoming you to Ethiopia Investment Conference 2024!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #071910; color: #a7f3d0; padding: 32px 40px; border-top: 1px solid #1e462f;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://eic-frontend.vercel.app/_next/image?url=%2FEIC.png&w=256&q=75" alt="EIC Logo" style="height: 32px; width: auto; opacity: 0.9; margin-bottom: 20px; filter: brightness(0) invert(1);">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #86efac;">
                      Ethiopian Investment Commission
                    </p>
                    <p style="margin: 0 0 20px; font-size: 12px; color: #a7f3d0; line-height: 1.5;">
                      በኢትዮጵያ ኢንቨስትመንት ኮሚሽን<br>
                      Driving economic growth through sustainable investment
                    </p>
                    
                    <!-- Social Links -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://www.linkedin.com/company/iie-hlbf2025/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">LinkedIn</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://x.com/iie_hlbf2025?s=11" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Twitter</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://web.facebook.com/people/Invest-in-Ethiopiahlbf-2025/61574823326798/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Facebook</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://www.instagram.com/investinethiopia_hlbf/" style="color: #a7f3d0; text-decoration: none; font-size: 12px;">Instagram</a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0; font-size: 11px; color: #4ade80; border-top: 1px solid #1e462f; padding-top: 16px; line-height: 1.6;">
                      This is an automated verification message. Please do not reply directly to this email.<br>
                      © 2024 Ethiopian Investment Commission. All rights reserved.<br>
                      <a href="https://eic-frontend.vercel.app/privacy" style="color: #86efac; text-decoration: none;">Privacy Policy</a> | 
                      <a href="https://eic-frontend.vercel.app/terms" style="color: #86efac; text-decoration: none;">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
