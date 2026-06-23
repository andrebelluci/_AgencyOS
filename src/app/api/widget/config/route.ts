import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api/cors";
import { getPublicKeyFromApiRequest } from "@/lib/api/public-key";
import {
  getWidgetPublicConfig,
  WidgetConfigError,
} from "@/modules/widget/service";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const publicKey = getPublicKeyFromApiRequest(request);

  if (!publicKey) {
    return jsonWithCors(
      request,
      { error: "public_key is required (query key/public_key or header x-public-key)." },
      { status: 400 },
    );
  }

  try {
    const config = await getWidgetPublicConfig(publicKey);
    return jsonWithCors(request, config);
  } catch (error) {
    if (error instanceof WidgetConfigError) {
      return jsonWithCors(request, { error: error.message }, { status: error.status });
    }

    console.error("[GET /api/widget/config]", error);

    return jsonWithCors(
      request,
      { error: "Failed to load widget configuration." },
      { status: 500 },
    );
  }
}
