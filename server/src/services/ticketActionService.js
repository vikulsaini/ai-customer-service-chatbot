const priorityWords = ["critical", "high", "medium", "low"];

export const getRequestedPriority = (message = "") => {
  const lower = message.toLowerCase();
  if (/\b(critical|urgent|sev1|p1|production down)\b/.test(lower)) return "critical";
  return priorityWords.find((priority) => lower.includes(priority)) || null;
};

export const isPureTicketCommand = (message = "") => (
  /^(create|open|raise|generate|new)\s+(a\s+)?ticket\.?$/i.test(message.trim())
);

export const wantsTicketCreation = (message = "") => (
  /\b(create|open|raise|generate|new)\b.*\bticket\b/i.test(message) ||
  /\bticket\b.*\b(create|open|raise|generate|new)\b/i.test(message)
);

export const wantsTicketList = (message = "") => (
  /\b(view|show|list|see|check)\b.*\btickets?\b/i.test(message)
);

export const wantsPriorityChange = (message = "") => (
  /\b(mark|set|make|change|update)\b.*\b(priority|urgent|critical|high|medium|low)\b/i.test(message) ||
  /\b(critical|high|medium|low)\s+priority\b/i.test(message)
);

export const isTicketDetailsFollowUp = (message = "", history = []) => {
  const lastAssistant = [...history].reverse().find((item) => item.role === "assistant")?.content || "";
  const lower = message.toLowerCase().trim();
  const isShortCommand = /^(hi|hello|hey|thanks|ok|okay|yes|no|create ticket|view tickets|mark high priority)$/.test(lower);
  return /issue summary|ticket details|affected service|priority/i.test(lastAssistant) && message.trim().length > 12 && !isShortCommand;
};

export const extractTicketIssue = (message = "") => {
  const cleaned = message
    .replace(/\b(please|kindly)\b/gi, "")
    .replace(/\b(create|open|raise|generate|new)\b\s+(a\s+)?\bticket\b\s*(for|about|because|:|-)?/gi, "")
    .replace(/\b(with|as)?\s*(critical|high|medium|low)\s+priority\b/gi, "")
    .replace(/\b(mark|set|make|change|update)\b.*\b(priority|urgent|critical|high|medium|low)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[,:;\-\s]+$/g, "")
    .trim();

  return cleaned.length >= 10 ? cleaned : "";
};

export const formatTicketId = (id) => `#${String(id).slice(0, 8).toUpperCase()}`;
