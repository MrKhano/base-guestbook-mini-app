export const guestbookAddress =
  "0x022b28604dCD7f72d88D1A3b32e6C4f426689a19" as const;

export const guestbookAbi = [
  {
    type: "function",
    name: "addMessage",
    stateMutability: "nonpayable",
    inputs: [{ name: "_text", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getMessages",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "user", type: "address" },
          { name: "text", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMessagesCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
