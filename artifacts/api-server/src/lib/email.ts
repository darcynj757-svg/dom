export interface ContactRequestEmailPayload {
  id: number;
  name: string;
  phone: string;
  message?: string | null;
  projectId?: number | null;
  createdAt?: Date | string | null;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return (
    '<tr><td style="padding:8px 12px;background:#faf9f7;border:1px solid #e8e4dd;' +
    'font-size:13px;color:#7a7268;white-space:nowrap">' +
    escapeHtml(label) +
    '</td><td style="padding:8px 12px;border:1px solid #e8e4dd;font-size:15px;color:#1c1a17">' +
    value +
    "</td></tr>"
  );
}

export async function sendContactRequestEmail(
  data: ContactRequestEmailPayload,
): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const to = (process.env["CONTACT_EMAIL_TO"] ?? "corvet777@gmail.com")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const from =
    process.env["CONTACT_EMAIL_FROM"] ??
    "Сайт Кедр Томск <zayavki@kedr-tomsk.ru>";

  const created = data.createdAt ? new Date(data.createdAt) : new Date();
  const createdLabel = created.toLocaleString("ru-RU", {
    timeZone: "Asia/Tomsk",
  });

  const phoneDigits = data.phone.replace(/[^+\d]/g, "");

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px">' +
    '<h2 style="font-size:18px;color:#1c1a17;margin:0 0 4px">Новая заявка с сайта</h2>' +
    '<p style="font-size:13px;color:#7a7268;margin:0 0 16px">kedr-tomsk.ru</p>' +
    '<table style="border-collapse:collapse;width:100%">' +
    row("Имя", escapeHtml(data.name)) +
    row(
      "Телефон",
      '<a href="tel:' +
        escapeHtml(phoneDigits) +
        '" style="color:#1c1a17">' +
        escapeHtml(data.name ? data.phone : data.phone) +
        "</a>",
    ) +
    (data.message ? row("Сообщение", escapeHtml(data.message)) : "") +
    (data.projectId != null ? row("Проект", escapeHtml(data.projectId)) : "") +
    row("Время (Томск)", escapeHtml(createdLabel)) +
    row("Номер заявки", escapeHtml(data.id)) +
    "</table></div>";

  const text = [
    "Новая заявка с сайта kedr-tomsk.ru",
    "Имя: " + data.name,
    "Телефон: " + data.phone,
    data.message ? "Сообщение: " + data.message : null,
    data.projectId != null ? "Проект: " + String(data.projectId) : null,
    "Время (Томск): " + createdLabel,
    "Номер заявки: " + String(data.id),
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Новая заявка с сайта — " + data.name + " — " + data.phone,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error("Resend error " + response.status + ": " + body);
  }
}
