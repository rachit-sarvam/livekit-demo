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
  linked_billers: Array<{
    upi_id: string;
    biller_name: string;
    category: string;
    consumer_id: string;
    due_date: string;
    last_bill_amount: number;
    type: string;
  }>;
  linked_bank_accounts: Array<{
    bank_name: string;
    account_type: string;
    account_number: string;
    is_default: boolean;
    balance: number;
  }>;
  transaction_history: Array<{
    transaction_id: string;
    timestamp: string;
    amount: number;
    status: string;
    receiver_upi_id: string;
    intent: string;
    sub_intent: string | null;
  }>;
}

export const PersonaDisplay: React.FC<PersonaDisplayProps> = ({ personaName }) => {
  // Find the persona details from the JSON file
  const persona = personaDetails.personas.find((p: PersonaDetail) => p.name === personaName);

  if (!persona) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-card h-full overflow-y-auto rounded-lg border p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 rounded-full p-3">
          <svg
            className="text-primary h-6 w-6"
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
          <h2 className="text-xl font-bold">{persona.name}</h2>
          <p className="text-muted-foreground text-sm">Current Persona</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Profile */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            Profile
          </h3>
          <div className="bg-muted/50 space-y-3 rounded-lg p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <span className="text-muted-foreground font-medium">UPI ID:</span>
              <span className="font-mono text-sm break-all">{persona.user_profile.upi_id}</span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <span className="text-muted-foreground font-medium">Mobile:</span>
              <span className="font-mono text-sm">{persona.user_profile.mobile_number}</span>
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Bank Accounts ({persona.linked_bank_accounts.length})
          </h3>
          <div className="space-y-3">
            {persona.linked_bank_accounts.map((account, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium">{account.bank_name}</span>
                      {account.is_default && (
                        <span className="bg-primary/20 text-primary rounded-full px-2 py-1 text-xs whitespace-nowrap">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <div className="truncate">{account.account_type}</div>
                      <div className="mt-1 font-mono text-xs break-all">
                        {account.account_number}
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Beneficiaries */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Saved Beneficiaries ({persona.saved_beneficiaries.length})
          </h3>
          <div className="space-y-3">
            {persona.saved_beneficiaries.map((beneficiary, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <span className="truncate font-medium capitalize">
                      {beneficiary.contact_name}
                    </span>
                    <span className="text-muted-foreground font-mono text-sm">
                      {beneficiary.mobile_number || 'No mobile number'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {beneficiary.upi_ids.map((upi, upiIndex) => (
                      <div
                        key={upiIndex}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center"
                      >
                        <span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium whitespace-nowrap">
                          {upi.provider}
                        </span>
                        <span className="font-mono text-sm break-all">{upi.upi_id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Billers */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Linked Billers ({persona.linked_billers.length})
          </h3>
          <div className="space-y-3">
            {persona.linked_billers.map((biller, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="truncate font-medium" title={biller.biller_name}>
                      {biller.biller_name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <div className="flex flex-wrap gap-1">
                        <span>{biller.category}</span>
                        <span>•</span>
                        <span>{biller.type}</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      <span className="font-medium">Consumer ID:</span>
                      <span className="ml-1 font-mono break-all">{biller.consumer_id}</span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap sm:text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(biller.last_bill_amount)}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      Due: {formatDate(biller.due_date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Recent Transactions ({persona.transaction_history.length})
          </h3>
          <div className="space-y-3">
            {persona.transaction_history.slice(0, 10).map((transaction, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-medium">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs whitespace-nowrap ${
                          transaction.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span>{transaction.intent}</span>
                      {transaction.sub_intent && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{transaction.sub_intent}</span>
                        </>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      <span className="font-medium">To:</span>
                      <span className="ml-1 font-mono break-all">
                        {truncateText(transaction.receiver_upi_id, 30)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right sm:text-right">
                    <div className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatDateTime(transaction.timestamp)}
                    </div>
                    <div
                      className="text-muted-foreground font-mono text-xs break-all"
                      title={transaction.transaction_id}
                    >
                      {truncateText(transaction.transaction_id, 12)}
                    </div>
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
