'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import type { ConnectionDetails } from '@/app/api/connection-details/route';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import { PersonaDisplay } from '@/components/persona-display';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
  persona?: string;
}

export const SessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  persona,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  useDebugMode({
    enabled: process.env.NODE_END !== 'production',
  });

  // Debug: Log connection details when they change
  useEffect(() => {
    console.log('Connection details changed:', connectionDetails);
  }, [connectionDetails]);

  // Fetch connection details when session starts
  useEffect(() => {
    if (sessionStarted && !connectionDetails) {
      const fetchDetails = async () => {
        try {
          const url = new URL('/api/connection-details', window.location.origin);
          if (persona) {
            url.searchParams.set('persona', persona);
          }
          const res = await fetch(url.toString());
          const data = await res.json();
          console.log('Fetched connection details:', data);
          setConnectionDetails(data);
        } catch (error) {
          console.error('Error fetching connection details:', error);
        }
      };
      fetchDetails();
    }
  }, [sessionStarted, connectionDetails, persona]);

  async function handleSendMessage(message: string) {
    await send(message);
  }

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: (
              <p className="w-full">
                {reason}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="whitespace-nowrap underline"
                >
                  See quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 20_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  return (
    <main
      ref={ref}
      inert={disabled}
      className={cn(
        'h-svh',
        // prevent page scrollbar when !chatOpen due to 'translate-y-20'
        !chatOpen && 'overflow-hidden'
      )}
    >
      {/* Left Sidebar - Persona Display */}
      {persona && sessionStarted && (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 z-40 hidden h-full w-96 border-r backdrop-blur md:block">
          {/* Debug info */}
          <div className="text-muted-foreground p-4 text-xs">
            <div>Connection Details: {connectionDetails ? 'Loaded' : 'Not loaded'}</div>
            <div>Room Name: {connectionDetails?.roomName || 'No room name'}</div>
          </div>

          <PersonaDisplay personaName={persona} roomName={connectionDetails?.roomName} />
        </div>
      )}

      {/* Right Content Area */}
      <div className={cn('relative h-full', persona && sessionStarted ? 'md:ml-96' : '')}>
        <ChatMessageView
          className={cn(
            'mx-auto min-h-svh w-full max-w-2xl px-3 pt-32 pb-40 transition-[opacity,translate] duration-300 ease-out md:px-0 md:pt-36 md:pb-48',
            chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-20 opacity-0'
          )}
        >
          <div className="space-y-3 whitespace-pre-wrap">
            <AnimatePresence>
              {messages.map((message: ReceivedChatMessage) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 1, height: 'auto', translateY: 0.001 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <ChatEntry hideName key={message.id} entry={message} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ChatMessageView>

        <div
          className={cn(
            'bg-background mp-12 fixed top-0 right-0 h-32 md:h-36',
            persona && sessionStarted ? 'left-0 md:left-96' : 'left-0'
          )}
        >
          {/* Header area */}
          {/* skrim */}
          <div className="from-background absolute bottom-0 left-0 h-12 w-full translate-y-full bg-gradient-to-b to-transparent" />
        </div>

        <MediaTiles chatOpen={chatOpen} hasPersonaSidebar={!!(persona && sessionStarted)} />

        <div
          className={cn(
            'bg-background fixed right-0 bottom-0 z-50 px-3 pt-2 pb-3 md:px-12 md:pb-12',
            persona && sessionStarted ? 'left-0 md:left-96' : 'left-0'
          )}
        >
          <motion.div
            key="control-bar"
            initial={{ opacity: 0, translateY: '100%' }}
            animate={{
              opacity: sessionStarted ? 1 : 0,
              translateY: sessionStarted ? '0%' : '100%',
            }}
            transition={{ duration: 0.3, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
          >
            <div className="relative z-10 mx-auto w-full max-w-2xl">
              {appConfig.isPreConnectBufferEnabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: sessionStarted && messages.length === 0 ? 1 : 0,
                    transition: {
                      ease: 'easeIn',
                      delay: messages.length > 0 ? 0 : 0.8,
                      duration: messages.length > 0 ? 0.2 : 0.5,
                    },
                  }}
                  aria-hidden={messages.length > 0}
                  className={cn(
                    'absolute inset-x-0 -top-12 text-center',
                    sessionStarted && messages.length === 0 && 'pointer-events-none'
                  )}
                >
                  <p className="animate-text-shimmer inline-block !bg-clip-text text-sm font-semibold text-transparent">
                    Agent is listening, ask it a question
                  </p>
                </motion.div>
              )}

              <AgentControlBar
                capabilities={capabilities}
                onChatOpenChange={setChatOpen}
                onSendMessage={handleSendMessage}
              />
            </div>
            {/* skrim */}
            <div className="from-background border-background absolute top-0 left-0 h-12 w-full -translate-y-full bg-gradient-to-t to-transparent" />
          </motion.div>
        </div>
      </div>
    </main>
  );
};
