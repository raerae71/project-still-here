const blockedWords = [
  "spamword1",
  "spamword2"
];

const reviewWords = [
  "kill",
  "suicide",
  "self harm",
  "medical advice",
  "diagnose"
];

export function moderateMessage(text) {
  const lower = text.toLowerCase();

  if (blockedWords.some((word) => lower.includes(word))) {
    return "rejected";
  }

  if (reviewWords.some((word) => lower.includes(word))) {
    return "review";
  }

  return "approved";
}
