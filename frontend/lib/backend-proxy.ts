export const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ?? "http://localhost:3002";

export async function parseBackendPayload(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    if (/<(?:!doctype|html|head|body)\b/i.test(text)) {
      return {
        message: "استجاب خادم الحجز برد غير صالح. تحقق من عنوان خادم الـ API وإعادة تشغيله.",
      };
    }

    return {
      message: text,
    };
  }
}

export function withForwardedCookies(
  request: Request,
  headers: Record<string, string> = {},
) {
  const cookie = request.headers.get("cookie");

  if (cookie) {
    headers.cookie = cookie;
  }

  return headers;
}
