import { useCallback, useEffect, useState } from 'react';
import { decodeJwt } from 'jose';
import { ConnectionDetails } from '@/app/api/connection-details/route';

const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

export default function useConnectionDetails() {
  // Generate room connection details, including:
  //   - A random Room name
  //   - A random Participant name
  //   - An Access Token to permit the participant to join the room
  //   - The URL of the LiveKit server to connect to
  //
  // In real-world application, you would likely allow the user to specify their
  // own participant name, and possibly to choose from existing rooms to join.

  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  const fetchConnectionDetails = useCallback(async (language?: string, persona?: string) => {
    setConnectionDetails(null);
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
      window.location.origin
    );

    // Add language and persona as query parameters
    if (language) {
      url.searchParams.set('language', language);
    }
    if (persona) {
      url.searchParams.set('persona', persona);
    }

    let data: ConnectionDetails;
    try {
      const res = await fetch(url.toString());
      data = await res.json();
    } catch (error) {
      console.error('Error fetching connection details:', error);
      throw new Error('Error fetching connection details!');
    }

    setConnectionDetails(data);
    return data;
  }, []);

  const isConnectionDetailsExpired = useCallback(() => {
    const token = connectionDetails?.participantToken;
    if (!token) {
      return true;
    }

    const jwtPayload = decodeJwt(token);
    if (!jwtPayload.exp) {
      return true;
    }
    const expiresAt = new Date(jwtPayload.exp - ONE_MINUTE_IN_MILLISECONDS);

    const now = new Date();
    return expiresAt >= now;
  }, [connectionDetails?.participantToken]);

  const existingOrRefreshConnectionDetails = useCallback(
    async (language?: string, persona?: string) => {
      if (isConnectionDetailsExpired() || !connectionDetails) {
        return fetchConnectionDetails(language, persona);
      } else {
        return connectionDetails;
      }
    },
    [connectionDetails, fetchConnectionDetails, isConnectionDetailsExpired]
  );

  return {
    connectionDetails,
    refreshConnectionDetails: fetchConnectionDetails,
    existingOrRefreshConnectionDetails,
  };
}
