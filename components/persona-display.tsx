'use client';

import React from 'react';
import personaDetails from '@/lib/persona-details.json';

interface PersonaDisplayProps {
  personaName: string;
}

interface PersonaDetail {
  name: string;
  user_profile: {
    upi_id: string;
    mobile_number: string;
  };
  saved_beneficiaries: Array<{
    contact_name: string;
    mobile_number: string | null;
    upi_ids: Array<{
      upi_id: string;
      provider: string;
    }>;
  }>;
}

export const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ personaName }) => {
  // Find the persona details from the JSON file
  const persona = personaDetails.personas.find((p: PersonaDetail) => p.name === personaName);

  if (!persona) {
    return null;
  }

  return (
    <div className="bg-card mt-20 mb-4 rounded-lg border p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/10 rounded-full p-2">
          <svg
            className="text-primary h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{persona.name}</h3>
          <p className="text-muted-foreground text-sm">Current Persona</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            Profile
          </h4>
          <div className="bg-muted/50 space-y-1 rounded p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">UPI ID:</span>
              <span className="font-mono">{persona.user_profile.upi_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile:</span>
              <span className="font-mono">{persona.user_profile.mobile_number}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Saved Beneficiaries ({persona.saved_beneficiaries.length})
          </h4>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {persona.saved_beneficiaries.map((beneficiary, index) => (
              <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-medium capitalize">{beneficiary.contact_name}</span>
                    <div className="text-muted-foreground font-mono text-xs">
                      {beneficiary.mobile_number || 'No mobile number'}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {beneficiary.upi_ids.length} UPI ID{beneficiary.upi_ids.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
