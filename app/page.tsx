"use client";

import { useEffect, useMemo, useState } from "react";
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

useEffect(() => {
  if (isSuccess) {
    setMessage("");
    refetch();
  }
}, [isSuccess, refetch]);

  function handleSubmit(e: React.FormEvent) {
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

  return (
    // ton JSX inchangé
  );
}