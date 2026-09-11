// ============================================================
// lib/stellar.ts
//
// DEMO MODE STELLAR SERVICE
// ------------------------------------------------------------
// This module is the single boundary between HulogHub's UI and
// the Stellar Network. Every function here is a realistic stand-in
// for what a production integration would do with the real
// `stellar-sdk` (https://stellar.github.io/js-stellar-sdk/).
//
// IMPORTANT: Nothing in this file talks to the real Stellar
// Network. All responses are simulated locally so the prototype
// can run without a backend. No transaction created here is a
// real, verifiable ledger entry — the UI must always present
// this as "Demo Mode".
//
// To wire up real Stellar support later, each function below
// notes exactly what SDK call(s) would replace the mock logic.
// ============================================================

import { mockStellarAddress, uid } from "./utils";

export interface StellarAccountInfo {
  address: string;
  network: "testnet" | "public";
}

export interface StellarTransactionRecord {
  hash: string;
  ledger: number;
  createdAt: string;
  status: "pending" | "verified" | "failed";
  memo: string;
}

const DEMO_NETWORK: StellarAccountInfo["network"] = "testnet";

/**
 * Simulate connecting a Stellar wallet (e.g. Freighter / Albedo in production).
 *
 * Real implementation would use something like:
 *   import { isConnected, getPublicKey } from "@stellar/freighter-api";
 *   const publicKey = await getPublicKey();
 */
export async function connectWallet(): Promise<StellarAccountInfo> {
  await simulateLatency();
  return {
    address: mockStellarAddress(),
    network: DEMO_NETWORK,
  };
}

/**
 * Real implementation would call Freighter's disconnect flow / simply
 * drop the cached public key, since Stellar wallets are non-custodial.
 */
export async function disconnectWallet(): Promise<void> {
  await simulateLatency(150);
}

/**
 * Simulate fetching a wallet's XLM / asset balance.
 *
 * Real implementation would use:
 *   const server = new Horizon.Server("https://horizon-testnet.stellar.org");
 *   const account = await server.loadAccount(publicKey);
 */
export async function getWalletBalance(address: string): Promise<number> {
  await simulateLatency();
  // Deterministic-looking demo balance derived from the address so it
  // stays stable across calls in a session.
  const seed = address.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.round(((seed % 500) + 120) * 10) / 10;
}

/**
 * Simulate submitting a contribution as a Stellar payment operation.
 *
 * Real implementation would build a transaction with the Stellar SDK:
 *   const tx = new TransactionBuilder(account, { fee, networkPassphrase })
 *     .addOperation(Operation.payment({ destination, asset, amount }))
 *     .addMemo(Memo.text(memo))
 *     .setTimeout(30)
 *     .build();
 *   tx.sign(sourceKeypair);
 *   await server.submitTransaction(tx);
 */
export async function createContributionTransaction(params: {
  groupId: string;
  memberId: string;
  amount: number;
}): Promise<StellarTransactionRecord> {
  await simulateLatency(900);
  return {
    hash: generateMockHash(),
    ledger: generateMockLedger(),
    createdAt: new Date().toISOString(),
    status: "pending",
    memo: `HULOG:${params.groupId.slice(-6)}:${params.memberId.slice(-6)}`,
  };
}

/**
 * Simulate the network confirming / verifying a submitted transaction.
 *
 * Real implementation would poll:
 *   const tx = await server.transactions().transaction(hash).call();
 */
export async function verifyTransaction(hash: string): Promise<StellarTransactionRecord["status"]> {
  await simulateLatency(1400);
  return "verified";
}

/**
 * Simulate looking up a past transaction's ledger record.
 *
 * Real implementation would use:
 *   await server.transactions().transaction(hash).call();
 */
export async function getTransaction(hash: string): Promise<StellarTransactionRecord> {
  await simulateLatency(400);
  return {
    hash,
    ledger: generateMockLedger(),
    createdAt: new Date().toISOString(),
    status: "verified",
    memo: "HULOG:demo",
  };
}

/**
 * Simulate fetching general ledger/network info for the transparency panel.
 *
 * Real implementation would use:
 *   const ledger = await server.ledgers().order("desc").limit(1).call();
 */
export async function getLedgerInfo(): Promise<{
  network: string;
  latestLedger: number;
  lastSyncSecondsAgo: number;
}> {
  await simulateLatency(300);
  return {
    network: "Stellar (Demo Testnet)",
    latestLedger: generateMockLedger(),
    lastSyncSecondsAgo: Math.floor(Math.random() * 180) + 5,
  };
}

/** Build a placeholder "explorer" URL. Not a real Stellar Explorer link. */
export function demoExplorerUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash} (demo placeholder — not a live record)`;
}

// ----------------------------- internal helpers -----------------------------

function generateMockHash(): string {
  const chars = "abcdef0123456789";
  let s = "";
  for (let i = 0; i < 64; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function generateMockLedger(): number {
  return 40_000_000 + Math.floor(Math.random() * 900_000);
}

function simulateLatency(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Re-exported so other modules can generate consistent demo IDs without
// importing utils directly for this narrow purpose.
export function generateTransactionId(): string {
  return uid("HUL");
}
