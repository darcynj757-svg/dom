export interface FormData {
  name: string;
  phone: string;
  message?: string;
  subject?: string;
}

const ENDPOINT = "/api/contact-requests";

export async function submitForm(data: FormData): Promise<void> {
  const name = data.name.trim();
  const phone = data.phone.trim();

  if (!name || !phone) {
    throw new Error("Укажите имя и телефон.");
  }

  const parts = [data.subject, data.message]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        message: parts.length > 0 ? parts.join(" / ") : null,
      }),
    });
  } catch {
    throw new Error("Нет связи с сервером. Позвоните нам, пожалуйста.");
  }

  if (!response.ok) {
    throw new Error("Не удалось отправить заявку. Позвоните нам, пожалуйста.");
  }
}
