import { Global } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';


export const createOAuth2Client = (): OAuth2Client => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  return client;
};