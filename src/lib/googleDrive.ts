import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_SECRET
);

if (process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  });
}

export const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});
