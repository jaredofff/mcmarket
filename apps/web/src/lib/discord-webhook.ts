import { normalizeResourceImageUrl } from "@/lib/resource-images";

export type ResourceNotificationInput = {
  title: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  coverImage?: string | null;
  resourceUrl?: string;
  resourcePath?: string;
  resourceType?: string;
  isUpdate?: boolean;
};

const NEW_RESOURCE_COLOR = 0xf59e0b;
const UPDATE_RESOURCE_COLOR = 0x3b82f6;
const DESCRIPTION_LIMIT = 160;

function truncateDescription(value?: string | null) {
  const description = value?.replace(/\s+/g, " ").trim();

  if (!description) {
    return "Nuevo recurso disponible en MC Market.";
  }

  if (description.length <= DESCRIPTION_LIMIT) {
    return description;
  }

  return `${description.slice(0, DESCRIPTION_LIMIT - 3).trimEnd()}...`;
}

function formatPrice(price?: number | null) {
  if (!price || price <= 0) {
    return "¡Gratis!";
  }

  return `$${price.toFixed(2)} USD`;
}

function getProductionBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return configuredUrl.replace(/\/+$/, "");
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const baseUrl = getProductionBaseUrl();

  if (!baseUrl || !value.startsWith("/")) {
    return value;
  }

  return `${baseUrl}${value}`;
}

function getResourceUrl(slug: string, resourceUrl?: string, resourcePath?: string) {
  if (resourceUrl) {
    return toAbsoluteUrl(resourceUrl);
  }

  return toAbsoluteUrl(resourcePath || `/plugins/${encodeURIComponent(slug)}`);
}

export async function sendResourceNotification({
  title,
  slug,
  description,
  price,
  coverImage,
  resourceUrl,
  resourcePath,
  resourceType = "Recurso",
  isUpdate = false,
}: ResourceNotificationInput) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const finalResourceUrl = getResourceUrl(slug, resourceUrl, resourcePath);
  const thumbnailUrl = toAbsoluteUrl(normalizeResourceImageUrl(coverImage, ""));
  const embedTitle = isUpdate
    ? `🔄 ¡Recurso Actualizado: ${title}!`
    : `🚀 ¡Nuevo Recurso Publicado: ${title}!`;

  const embed = {
    title: embedTitle,
    description: truncateDescription(description),
    color: isUpdate ? UPDATE_RESOURCE_COLOR : NEW_RESOURCE_COLOR,
    fields: [
      {
        name: "💰 Precio",
        value: formatPrice(price),
        inline: true,
      },
      {
        name: "🌐 Ver en la Web",
        value: `[Abrir ${resourceType}](${finalResourceUrl})`,
        inline: true,
      },
    ],
    thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
    timestamp: new Date().toISOString(),
    footer: {
      text: "MC Market",
    },
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [embed],
    }),
  });

  if (!response.ok) {
    console.error(`Discord webhook failed with status ${response.status}`);
  }
}
