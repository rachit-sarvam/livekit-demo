import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { type AccessTokenOptions } from 'livekit-server-sdk';

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// don't cache the results
export const revalidate = 0;

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function GET(request: Request) {
  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (API_KEY === undefined) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (API_SECRET === undefined) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Extract language and persona from query parameters
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'hi-IN';
    const persona = searchParams.get('persona') || '';

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      language,
      persona
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  language: string = 'hi-IN',
  persona: string = ''
) {
  const metadata = JSON.stringify({
    language: language,
    persona: persona,
    user_type: 'customer',
  });

  // Token expiration (1 hour from now)
  const exp = Math.floor(Date.now() / 1000) + 3600;

  // Token payload following the Python example structure
  const payload = {
    exp: exp,
    iss: API_KEY,
    sub: userInfo.identity,
    metadata: metadata,
    video: {
      room: 'new-room',
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    },
    // Room configuration to dispatch the agent
    roomConfig: {
      agents: [
        {
          agentName: 'master-banking-agent',
          metadata: JSON.stringify({
            language: language,
            persona: persona,
            user_type: 'customer',
          }),
        },
      ],
    },
  };

  // Sign the token using HS256 algorithm
  const token = jwt.sign(payload, API_SECRET!, { algorithm: 'HS256' });
  return token;
}
