/**
 * Отправка заявки через Web3Forms.
 * Чтобы получать письма, зарегистрируйтесь на https://web3forms.com
 * и вставьте ваш ключ в переменную окружения VITE_WEB3FORMS_KEY.
 */

export interface FormData {
  name: string;
  phone: string;
  message?: string;
  subject?: string;
}

export async function submitForm(data: FormData): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

  if (!accessKey) {
    // Ключ не настроен — имитируем успех в режиме разработки
    if (import.meta.env.DEV) {
      console.warn(
        "[Форма] VITE_WEB3FORMS_KEY не задан. " +
          "Зарегистрируйтесь на https://web3forms.com и добавьте ключ в .env."
      );
      await new Promise((r) => setTimeout(r, 600));
      return;
    }
    throw new Error("Форма не настроена. Свяжитесь с нами по телефону.");
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: data.subject ?? "Новая заявка с сайта kedr-tomsk.ru",
      name: data.name,
      phone: data.phone,
      message: data.message ?? "",
      from_name: "Сайт Кедр Томск",
    }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message ?? "Ошибка отправки");
  }
}
