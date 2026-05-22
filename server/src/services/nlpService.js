const faq = [
  { keys: ["account", "access", "login", "password", "reset", "forgot"], intent: "account_access", category: "account", answer: "Please verify your login credentials. If the issue persists, use the Forgot Password option to reset your password." },
  { keys: ["vpn", "connect", "remote"], intent: "vpn_support", category: "network", answer: "Check your internet, restart the VPN client, and verify MFA. If it still fails, I can create a network support ticket." },
  { keys: ["email", "outlook", "mail"], intent: "email_support", category: "productivity", answer: "For email issues, confirm mailbox storage, restart the client, and try webmail. I can escalate if delivery is affected." },
  { keys: ["server", "down", "latency", "slow"], intent: "incident", category: "infrastructure", answer: "This sounds like an infrastructure incident. Please share the service name, region, and error message." }
];

export const analyzeText = (text = "") => {
  const lower = text.toLowerCase();
  const matched = faq.find((item) => item.keys.some((key) => lower.includes(key)));
  const negative = ["angry", "bad", "down", "failed", "error", "not working", "urgent", "critical"].some((w) => lower.includes(w));
  const positive = ["thanks", "great", "resolved", "fixed", "good"].some((w) => lower.includes(w));
  const words = lower.match(/[a-z0-9]+/g) || [];
  const keywords = [...new Set(words.filter((w) => w.length > 4))].slice(0, 8);

  return {
    intent: matched?.intent || "general_support",
    sentiment: negative ? "negative" : positive ? "positive" : "neutral",
    category: matched?.category || (negative ? "technical" : "general"),
    keywords,
    faqAnswer: matched?.answer
  };
};

export const quickRepliesFor = (category) => {
  const map = {
    network: ["Create VPN ticket", "Show troubleshooting steps", "Check outage status"],
    account: ["Reset password", "Update profile", "Contact admin"],
    infrastructure: ["Create critical ticket", "Add error logs", "Mark unresolved"],
    general: ["Create ticket", "Talk to support", "Export chat"]
  };
  return map[category] || map.general;
};
