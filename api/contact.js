const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = readBody(req);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const company = String(body.company || "").trim();
  const stuck = String(body.stuck || "").trim();
  const honeypot = String(body.website || "").trim();

  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }
  if (!name || !email || !stuck) {
    res.status(400).json({ error: "Name, email, and a short note are required." });
    return;
  }
  if (!EMAIL_RE.test(email) || name.length > 200 || email.length > 200 || company.length > 200 || stuck.length > 8000) {
    res.status(400).json({ error: "Check the fields and try again." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Mail is not configured yet." });
    return;
  }

  const from = process.env.RESEND_FROM || "High Plains Digital <forms@highplains.digital>";
  const to = process.env.CONTACT_TO || "kyle@highplains.digital";
  const subjectBits = ["Website inquiry"];
  if (name) subjectBits.push(name);
  if (company) subjectBits.push(company);

  const text = [
    "Name: " + name,
    "Email: " + email,
    "Company: " + (company || "(none)"),
    "",
    "Where they're stuck:",
    stuck,
  ].join("\n");

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: subjectBits.join(" — "),
      text,
    }),
  });

  if (!r.ok) {
    let detail = "";
    try { detail = await r.text(); } catch {}
    console.error("Resend error", r.status, detail.slice(0, 400));
    res.status(502).json({ error: "Could not send the message. Try emailing kyle@highplains.digital." });
    return;
  }

  res.status(200).json({ ok: true });
}
