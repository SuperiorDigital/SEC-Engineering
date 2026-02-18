const WORDPRESS_BASE_URL =
  process.env.WORDPRESS_BASE_URL ??
  process.env.NEXT_PUBLIC_WORDPRESS_BASE_URL ??
  "";

const WORDPRESS_API_ROOT = WORDPRESS_BASE_URL
  ? `${WORDPRESS_BASE_URL.replace(/\/$/, "")}/wp-json`
  : "";

type RequestOptions = {
  revalidate?: number;
  tags?: string[];
};

export function isWordPressConfigured(): boolean {
  return Boolean(WORDPRESS_API_ROOT);
}

export async function wpFetch<T>(
  path: string,
  init?: RequestInit,
  options: RequestOptions = {}
): Promise<T> {
  if (!WORDPRESS_API_ROOT) {
    throw new Error(
      "WordPress API is not configured. Set WORDPRESS_BASE_URL in frontend/.env.local"
    );
  }

  const response = await fetch(`${WORDPRESS_API_ROOT}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: {
      revalidate: options.revalidate ?? 120,
      tags: options.tags,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `WordPress request failed (${response.status} ${response.statusText}): ${body.slice(
        0,
        300
      )}`
    );
  }

  return (await response.json()) as T;
}

function getWriteAuthHeader(): string {
  const username = process.env.WORDPRESS_API_USER;
  const appPassword = process.env.WORDPRESS_API_APP_PASSWORD;

  if (!username || !appPassword) {
    throw new Error(
      "Missing write credentials. Set WORDPRESS_API_USER and WORDPRESS_API_APP_PASSWORD."
    );
  }

  return `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`;
}

export async function wpWrite<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  return wpFetch<T>(
    path,
    {
      method,
      headers: {
        Authorization: getWriteAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
    { revalidate: 0 }
  );
}
