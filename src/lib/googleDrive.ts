import { google } from 'googleapis';

export const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_SECRET!,
    credentials: { refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  }),
});

