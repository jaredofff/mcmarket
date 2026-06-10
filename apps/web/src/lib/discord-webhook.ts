export type ResourceNotificationInput = {
  title: string;
  slug: string;
  description?: string | null;
  tier?: string | null;
  coverImage?: string | null;
  resourceUrl?: string;
  resourcePath?: string;
  resourceType?: string;
  isUpdate?: boolean;
};

export type ResourceNotificationResult =
  | { ok: true; status: number }
  | { ok: false; reason: "missing-webhook" }
  | { ok: false; reason: "discord-error"; status: number; message: string }
  | { ok: false; reason: "request-error"; message: string };

const NEW_RESOURCE_COLOR = 0xf59e0b;
const UPDATE_RESOURCE_COLOR = 0x3b82f6;
const DESCRIPTION_LIMIT = 160;
const DISCORD_LINK_BUTTON_STYLE = 5;

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

function formatTier(tier?: string | null) {
  const normalizedTier = (tier || "free").toLowerCase();

  if (normalizedTier === "legend" || normalizedTier === "elite") {
    return "Legend";
  }

  if (normalizedTier === "vip" || normalizedTier === "premium") {
    return "VIP";
  }

  return "Free";
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

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function getThumbnailUrl(coverImage?: string | null) {
  const value = coverImage?.trim();

  if (!value) {
    return "";
  }

  return toAbsoluteUrl(value);
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
  tier,
  coverImage,
  resourceUrl,
  resourcePath,
  resourceType = "Recurso",
  isUpdate = false,
}: ResourceNotificationInput) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook skipped: DISCORD_WEBHOOK_URL is not configured");
    return { ok: false, reason: "missing-webhook" } satisfies ResourceNotificationResult;
  }

  try {
    const finalResourceUrl = getResourceUrl(slug, resourceUrl, resourcePath);
    const thumbnailUrl = getThumbnailUrl(coverImage);
    const hasClickableUrl = isAbsoluteHttpUrl(finalResourceUrl);
    const embedTitle = isUpdate
      ? `🔄 ¡Recurso Actualizado: ${title}!`
      : `🚀 ¡Nuevo Recurso Publicado: ${title}!`;

    const embed = {
      title: embedTitle,
      description: truncateDescription(description),
      color: isUpdate ? UPDATE_RESOURCE_COLOR : NEW_RESOURCE_COLOR,
      fields: [
        {
          name: "🏷️ Rango",
          value: formatTier(tier),
          inline: true,
        },
        {
          name: "🌐 Ver en la Web",
          value: hasClickableUrl ? finalResourceUrl : "Configura NEXT_PUBLIC_SITE_URL para activar el enlace.",
          inline: true,
        },
      ],
      url: hasClickableUrl ? finalResourceUrl : undefined,
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
        components: hasClickableUrl
          ? [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: DISCORD_LINK_BUTTON_STYLE,
                    label: `Abrir ${resourceType}`,
                    url: finalResourceUrl,
                  },
                ],
              },
            ]
          : undefined,
      }),
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      console.error(`Discord webhook failed with status ${response.status}: ${message}`);
      return {
        ok: false,
        reason: "discord-error",
        status: response.status,
        message,
      } satisfies ResourceNotificationResult;
    }

    return { ok: true, status: response.status } satisfies ResourceNotificationResult;
  } catch (error) {
    console.error("Discord webhook request failed:", error);
    return {
      ok: false,
      reason: "request-error",
      message: error instanceof Error ? error.message : "Unknown Discord webhook error",
    } satisfies ResourceNotificationResult;
  }
}
