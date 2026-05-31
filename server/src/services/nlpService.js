const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "cannot",
  "could",
  "error",
  "from",
  "have",
  "help",
  "into",
  "issue",
  "please",
  "problem",
  "show",
  "that",
  "their",
  "there",
  "this",
  "with",
  "would"
]);

const intentCatalog = [
  {
    intent: "password_reset",
    category: "account",
    priority: 12,
    phrases: ["reset password", "forgot password", "change password", "password reset", "recover password"],
    terms: ["password", "otp", "locked"],
    answer: "Use Forgot Password on the login page, enter your registered email, copy the reset token, then set a new password from the reset flow."
  },
  {
    intent: "contact_admin",
    category: "account",
    priority: 11,
    phrases: ["contact admin", "admin help", "administrator", "blocked account", "suspend account"],
    terms: ["admin", "blocked", "suspended"],
    answer: "I can connect this to an admin path. Share the affected account email, issue summary, and urgency, or create a ticket so an admin can review it."
  },
  {
    intent: "profile_update",
    category: "profile",
    priority: 11,
    phrases: ["update profile", "edit profile", "change name", "profile image", "profile photo"],
    terms: ["profile", "avatar", "name"],
    answer: "Open the Profile page to update your name or profile image. Your email address is kept fixed for account security."
  },
  {
    intent: "account_access",
    category: "account",
    priority: 8,
    phrases: ["cannot login", "cant login", "can't login", "sign in", "login issue", "account access"],
    terms: ["account", "access", "credential", "signin", "login"],
    answer: "For account access, first confirm the email is registered. If the password is wrong, use Forgot Password; if the account is blocked, contact an admin."
  },
  {
    intent: "vpn_support",
    category: "network",
    priority: 9,
    phrases: ["vpn not connecting", "remote access", "vpn issue", "mfa failed", "vpn timeout"],
    terms: ["vpn", "remote", "connection", "connect", "tunnel", "mfa"],
    answer: "Check your internet connection, restart the VPN client, and verify MFA. If it still fails, share the VPN error code and I can create a network ticket."
  },
  {
    intent: "network_support",
    category: "network",
    priority: 8,
    phrases: ["internet not working", "wifi issue", "dns issue", "network slow", "lan issue"],
    terms: ["wifi", "internet", "network", "dns", "router", "ip", "lan"],
    answer: "For network issues, restart Wi-Fi, test another site, and share whether this affects one device or multiple users."
  },
  {
    intent: "email_support",
    category: "productivity",
    priority: 8,
    phrases: ["mail not syncing", "outlook not syncing", "email issue", "cannot send email", "cannot receive email"],
    terms: ["email", "outlook", "mail", "inbox", "smtp", "imap", "sync"],
    answer: "For email issues, check mailbox storage, restart the mail client, and try webmail. If sending or receiving is blocked, I can escalate it."
  },
  {
    intent: "incident",
    category: "infrastructure",
    priority: 10,
    phrases: ["production down", "server down", "database down", "service unavailable", "major outage"],
    terms: ["server", "down", "latency", "slow", "crash", "unavailable", "production", "database"],
    answer: "This sounds like an infrastructure incident. Please share the service name, region, impact, and exact error message."
  },
  {
    intent: "license_support",
    category: "software",
    priority: 10,
    phrases: ["check license", "license key", "software license", "activation failed", "subscription expired"],
    terms: ["license", "activation", "subscription", "expired"],
    answer: "To check a license, share the software name, license email or asset ID, and the exact activation message. Do not paste private license keys in chat."
  },
  {
    intent: "error_code_collection",
    category: "technical",
    priority: 10,
    phrases: ["share error code", "error code", "error message", "exception message"],
    terms: ["exception", "stacktrace", "failed", "crash"],
    answer: "Please share the exact error code, affected application, device or browser, and the action you were trying when it appeared."
  },
  {
    intent: "software_support",
    category: "software",
    priority: 7,
    phrases: ["install software", "software issue", "app not opening", "setup failed", "upgrade application"],
    terms: ["install", "software", "application", "app", "setup", "upgrade"],
    answer: "For software support, confirm the application name, version, operating system, and any installation or license error shown."
  },
  {
    intent: "hardware_support",
    category: "hardware",
    priority: 7,
    phrases: ["printer not working", "laptop issue", "keyboard issue", "scanner issue", "hardware issue"],
    terms: ["printer", "print", "scanner", "keyboard", "mouse", "laptop", "hardware", "device"],
    answer: "For hardware issues, check cable or Bluetooth connectivity, restart the device, and share the device model plus any error indicator."
  },
  {
    intent: "ticket_status",
    category: "ticket",
    priority: 8,
    phrases: ["ticket status", "view tickets", "create ticket", "raise ticket", "track ticket", "mark high priority"],
    terms: ["ticket", "status", "assigned", "priority", "escalate"],
    answer: "I can help with ticket handling. Share the issue summary and priority, or create a new ticket from the Tickets page."
  },
  {
    intent: "faq_search",
    category: "general",
    priority: 6,
    phrases: ["show faq", "search faq", "frequently asked", "common questions"],
    terms: ["faq", "question", "guide"],
    answer: "Open the FAQ page or ask your question here. I can match common IT support topics and suggest the next step."
  }
];

const sentimentLexicon = {
  negative: ["angry", "bad", "broken", "cannot", "can't", "critical", "crash", "down", "failed", "failure", "frustrated", "not syncing", "not working", "urgent", "unavailable"],
  positive: ["thanks", "thank you", "great", "resolved", "fixed", "good", "works now", "perfect"]
};

const phraseScore = (lower, phrase) => {
  if (lower === phrase) return 15;
  if (lower.includes(phrase)) return phrase.split(" ").length > 1 ? 8 : 4;
  return 0;
};

const termScore = (tokens, term) => (tokens.includes(term) ? 2 : 0);

const detectIntent = (lower, tokens) => {
  const scored = intentCatalog
    .map((item) => {
      const score =
        item.priority +
        item.phrases.reduce((sum, phrase) => sum + phraseScore(lower, phrase), 0) +
        item.terms.reduce((sum, term) => sum + termScore(tokens, term), 0);
      return { ...item, score };
    })
    .filter((item) => item.score > item.priority)
    .sort((a, b) => b.score - a.score || b.priority - a.priority);

  return scored[0] || null;
};

const detectSentiment = (lower) => {
  const negativeScore = sentimentLexicon.negative.reduce((score, word) => score + (lower.includes(word) ? 1 : 0), 0);
  const positiveScore = sentimentLexicon.positive.reduce((score, word) => score + (lower.includes(word) ? 1 : 0), 0);
  if (negativeScore > positiveScore) return { sentiment: "negative", sentimentScore: -negativeScore };
  if (positiveScore > negativeScore) return { sentiment: "positive", sentimentScore: positiveScore };
  return { sentiment: "neutral", sentimentScore: 0 };
};

const extractEntities = (text) => {
  const ticketId = text.match(/#?[a-f0-9]{8,24}/i)?.[0] || null;
  const email = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] || null;
  const priority = text.match(/\b(critical|urgent|high|medium|low|p1|sev1)\b/i)?.[1]?.toLowerCase() || null;
  const errorCode = text.match(/\b(?:err|error|code)[-_:\s]*([a-z0-9-]{3,})\b/i)?.[1] || null;
  return { ticketId, email, priority, errorCode };
};

export const analyzeText = (text = "") => {
  const lower = text.toLowerCase().trim();
  const tokens = lower.match(/[a-z0-9]+/g) || [];
  const matched = detectIntent(lower, tokens);
  const { sentiment, sentimentScore } = detectSentiment(lower);
  const keywords = [...new Set(tokens.filter((word) => word.length > 3 && !stopWords.has(word)))].slice(0, 10);

  return {
    intent: matched?.intent || "general_support",
    sentiment,
    sentimentScore,
    category: matched?.category || (sentiment === "negative" ? "technical" : "general"),
    confidence: matched ? Math.min(0.98, Number((matched.score / 30).toFixed(2))) : 0.35,
    keywords,
    entities: extractEntities(text),
    faqAnswer: matched?.answer
  };
};

export const quickRepliesFor = (category, intent) => {
  const byIntent = {
    password_reset: ["Forgot password", "Contact admin", "Create ticket"],
    contact_admin: ["Create ticket", "Account blocked", "View profile"],
    profile_update: ["Open profile", "Update name", "Contact admin"],
    license_support: ["Share software name", "Share error code", "Create software ticket"],
    error_code_collection: ["Share error code", "Create ticket", "Mark urgent"],
    ticket_status: ["Create ticket", "View tickets", "Mark high priority"],
    faq_search: ["Search FAQ", "Create ticket", "Talk to support"]
  };

  const byCategory = {
    network: ["Create VPN ticket", "Show troubleshooting steps", "Check outage status"],
    account: ["Reset password", "Update profile", "Contact admin"],
    profile: ["Open profile", "Update name", "Contact admin"],
    infrastructure: ["Create critical ticket", "Add error logs", "Mark unresolved"],
    software: ["Create software ticket", "Share error code", "Check license"],
    hardware: ["Create hardware ticket", "Add device model", "Mark urgent"],
    productivity: ["Open mail ticket", "Try webmail", "Check storage"],
    ticket: ["Create ticket", "View tickets", "Mark high priority"],
    technical: ["Share error code", "Create ticket", "Mark urgent"],
    general: ["Create ticket", "Talk to support", "Export chat"]
  };

  return byIntent[intent] || byCategory[category] || byCategory.general;
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
    profile: `${name}you can update your profile from the Profile page. You can change your display name and profile image; email remains locked for account security.`,
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
