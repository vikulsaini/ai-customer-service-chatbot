const intents = [
  { keys: ["account", "access", "login", "password", "reset", "forgot", "credential", "signin", "sign in"], intent: "account_access", category: "account", answer: "Please verify your login credentials. If the issue persists, use the Forgot Password option to reset your password." },
  { keys: ["vpn", "remote", "connection", "connect", "tunnel", "mfa"], intent: "vpn_support", category: "network", answer: "Check your internet connection, restart the VPN client, and verify MFA. If it still fails, share the VPN error code and I can create a network ticket." },
  { keys: ["email", "outlook", "mail", "inbox", "smtp", "imap", "sync"], intent: "email_support", category: "productivity", answer: "For email issues, check mailbox storage, restart the mail client, and try webmail. If sending or receiving is blocked, I can escalate it." },
  { keys: ["server", "down", "latency", "slow", "crash", "unavailable", "production", "database"], intent: "incident", category: "infrastructure", answer: "This sounds like an infrastructure incident. Please share the service name, region, impact, and exact error message." },
  { keys: ["install", "software", "application", "app", "license", "setup", "update"], intent: "software_support", category: "software", answer: "For software support, confirm the application name, version, operating system, and any installation or license error shown." },
  { keys: ["printer", "print", "scanner", "keyboard", "mouse", "laptop", "hardware", "device"], intent: "hardware_support", category: "hardware", answer: "For hardware issues, check cable or Bluetooth connectivity, restart the device, and share the device model plus any error indicator." },
  { keys: ["wifi", "internet", "network", "dns", "router", "ip", "lan"], intent: "network_support", category: "network", answer: "For network issues, restart Wi-Fi, test another site, and share whether this affects one device or multiple users." },
  { keys: ["ticket", "status", "assigned", "priority", "escalate"], intent: "ticket_status", category: "ticket", answer: "I can help with ticket handling. Share the issue summary and priority, or create a new ticket from the Tickets page." }
];

export const analyzeText = (text = "") => {
  const lower = text.toLowerCase();
  const matched = intents.find((item) => item.keys.some((key) => lower.includes(key)));
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
    software: ["Create software ticket", "Share error code", "Check license"],
    hardware: ["Create hardware ticket", "Add device model", "Mark urgent"],
    productivity: ["Open mail ticket", "Try webmail", "Check storage"],
    ticket: ["Create ticket", "View tickets", "Mark high priority"],
    general: ["Create ticket", "Talk to support", "Export chat"]
  };
  return map[category] || map.general;
};

export const buildLocalSupportReply = ({ message, analysis, history = [], user }) => {
  if (analysis.faqAnswer) return analysis.faqAnswer;

  const lastAssistant = [...history].reverse().find((item) => item.role === "assistant")?.content;
  const keywordText = analysis.keywords.length ? ` I noticed these keywords: ${analysis.keywords.join(", ")}.` : "";
  const followUp = lastAssistant ? " Based on our previous messages, please add any new error details so I can keep the context together." : "";
  const name = user?.name ? `${user.name.split(" ")[0]}, ` : "";

  const replies = {
    technical: `${name}this looks like a technical issue.${keywordText} Please share the application name, exact error message, when it started, and whether other users are affected.${followUp}`,
    general: `${name}I can help with that. Please tell me the affected service, what you expected to happen, what happened instead, and the urgency level.${followUp}`,
    account: `${name}for account access, verify your email and password first. If login still fails, use Forgot Password and mention any error shown on the login page.`,
    network: `${name}for network connectivity, test another website, restart Wi-Fi or VPN, and tell me whether this affects one device or everyone on the network.`,
    infrastructure: `${name}this may be an incident. Share the service name, region, number of affected users, and any logs or error codes so it can be prioritized.`,
    software: `${name}for software support, share the app name, version, operating system, and installation or license error. I can help create a ticket if it blocks work.`,
    hardware: `${name}for hardware support, share the device type/model, connection method, and any indicator lights or error messages.`,
    productivity: `${name}for email/productivity issues, try the web version, check storage, restart the client, and share whether sending, receiving, or syncing is affected.`,
    ticket: `${name}I can help with ticket tracking. Share the issue summary, priority, and any existing ticket ID, or create a new ticket from the Tickets page.`
  };

  if (/^(hi|hello|hey|namaste)\b/i.test(message.trim())) {
    return `${name}hello. I can help with account access, VPN, email, software, hardware, server incidents, and support tickets. What issue are you facing?`;
  }

  return replies[analysis.category] || replies.general;
};
