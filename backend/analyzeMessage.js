function analyzeMessage({ message, screenshot }) {
  const rawText =
    (typeof message === "string" && message.trim()) ||
    (typeof screenshot === "string" && screenshot.trim()) ||
    "";

  if (!rawText) {
    return { verdict: "Safe" };
  }

  let text = rawText
    .toLowerCase()
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 🔧 Fix broken OCR URLs
  text = text
    .replace(/https?\s*:\s*\/\s*\//gi, "https://")
    .replace(/https?:\/(?!\/)/gi, match => match + "/")
    .replace(/\s*\.\s*/g, ".");

  // 🔍 URL extraction (https:// OR www.)
  const urlMatch = text.match(/(?:https?:\/\/|www\.)([a-z0-9.-]+)/i);
  const domain = urlMatch ? urlMatch[1] : null;

  // ✅ Official domain whitelist
  const officialDomains = [
    "idfcbank.com",
    "idfcfirstbank.com",
    "idfcs.in",
    "idfcfs.in",
    "icicibank.com",
    "hdfcbank.com",
    "sbi.co.in",
    "axisbank.com",
    "yesbank.in",
    "kotak.com",
    "pnbindia.in",
    "vodafone.com",
    "vodafone.in",
    "amazon.in",
    "amazon.com",
    "flipkart.com"
  ];

  /* ===============================
     URL-FIRST DECISION (STABLE)
     =============================== */
  if (domain) {
    // 1️⃣ Official domain → SAFE
    const isOfficial = officialDomains.some(d =>
      domain === d || domain.endsWith("." + d)
    );

    if (isOfficial) {
      return {
        verdict: "Safe",
        explanation: "Official and trusted website link detected."
      };
    }

    // 2️⃣ Numbers in domain → SCAM
    if (/\d/.test(domain)) {
      return {
        verdict: "Scam",
        explanation: "Suspicious link containing numbers detected."
      };
    }

    // 3️⃣ Hyphen in domain → SCAM (phishing pattern)
    if (domain.includes("-")) {
      return {
        verdict: "Scam",
        explanation: "Suspicious structure in link detected."
      };
    }

    // 4️⃣ Unknown domain → SCAM
    return {
      verdict: "Scam",
      explanation: "Unverified or suspicious link detected."
    };
  }

  /* ===============================
     KEYWORD CHECK (NO URL)
     =============================== */
  const scamKeywords = [
    "urgent",
    "urgently",
    "emergency",
    "loan",
    "instant",
    "visit",
    "fee",
    "additional fee",
    "additional charges",
    "additional fees",
    "blocked",
    "suspended",
    "verify"
  ];

  for (const word of scamKeywords) {
    if (text.includes(word)) {
      return {
        verdict: "Scam",
        explanation: "Urgent or risky keywords detected."
      };
    }
  }

  return {
    verdict: "Safe",
    explanation: "No scam indicators detected."
  };
}

module.exports = analyzeMessage;