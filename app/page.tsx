"use client";

import { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { base } from "wagmi/chains";
import { guestbookAbi, guestbookAddress } from "@/lib/guestbook";

type GuestbookMessage = {
  user: `0x${string}`;
  text: string;
  timestamp: bigint;
};

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: bigint) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

export default function Home() {
  const { isConnected, chain } = useAccount();
  const [message, setMessage] = useState("");

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch,
  } = useReadContract({
    address: guestbookAddress,
    abi: guestbookAbi,
    functionName: "getMessages",
    chainId: base.id,
  });

  const messages = useMemo(() => {
    return (messagesData as GuestbookMessage[] | undefined)?.slice().reverse() ?? [];
  }, [messagesData]);

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    writeContract({
      address: guestbookAddress,
      abi: guestbookAbi,
      functionName: "addMessage",
      args: [message.trim()],
      chainId: base.id,
    });
  }

  if (isSuccess) {
    refetch();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Built on Base
            </p>
            <h1 className="mt-2 text-4xl font-bold">Base Guestbook</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              A simple onchain guestbook where anyone can connect a wallet and
              leave a message on Base.
            </p>
          </div>

          <ConnectButton />
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Leave a message</h2>
          <p className="mt-2 text-sm text-slate-600">
            Write a short message and store it onchain through the guestbook smart contract.
          </p>

          {!isConnected && (
            <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Connect your wallet to post a message.
            </p>
          )}

          {isConnected && chain?.id !== base.id && (
            <p className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Please switch your wallet to Base.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say hello to Base..."
              maxLength={280}
              className="min-h-[140px] rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-blue-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{message.length}/280</span>

              <button
                type="submit"
                disabled={
                  !isConnected ||
                  chain?.id !== base.id ||
                  !message.trim() ||
                  isPending ||
                  isConfirming
                }
                className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending || isConfirming ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>

          {hash && (
            <p className="mt-4 break-all text-sm text-slate-600">
              Transaction hash: {hash}
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600">
              Error: {error.message}
            </p>
          )}

          {isSuccess && (
            <p className="mt-4 text-sm text-green-600">
              Message sent successfully.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Latest messages</h2>
            <button
              onClick={() => refetch()}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {isLoadingMessages ? (
            <p className="mt-4 text-sm text-slate-600">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No messages yet.</p>
          ) : (
            <div className="mt-5 grid gap-4">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.user}-${msg.timestamp.toString()}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-slate-900">
                      {shortenAddress(msg.user)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-slate-700">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}