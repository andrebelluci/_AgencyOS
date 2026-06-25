import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api/cors";
import {
  beginPublicApiRequest,
  finishPublicApiResponse,
} from "@/lib/api/public-guards";
import {
  logPublicApiError,
  PUBLIC_API_ERRORS,
} from "@/lib/api/public-error";
import { getPublicKeyFromApiRequest } from "@/lib/api/public-key";
import {
  getWidgetPublicConfig,
  WidgetConfigError,
} from "@/modules/widget/service";

const ROUTE = "/api/widget/config";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const publicKey = getPublicKeyFromApiRequest(request);

  if (!publicKey) {
    const guard = beginPublicApiRequest(request, ROUTE);
    if (!guard.ok) {
      return guard.response;
    }

    const response = jsonWithCors(
      request,
      {
        error:
          "public_key is required (query key/public_key or header x-public-key).",
      },
      { status: 400 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }

  const guard = beginPublicApiRequest(request, ROUTE, { publicKey });
  if (!guard.ok) {
    return guard.response;
  }

  try {
    const config = await getWidgetPublicConfig(publicKey);
    const response = jsonWithCors(request, config);
    return finishPublicApiResponse(request, guard.ctx, response);
  } catch (error) {
    if (error instanceof WidgetConfigError) {
      const response = jsonWithCors(
        request,
        { error: error.message },
        { status: error.status },
      );
      return finishPublicApiResponse(request, guard.ctx, response);
    }

    logPublicApiError(ROUTE, error, {
      requestId: guard.ctx.requestId,
      tenantId: guard.ctx.tenantId,
    });

    const response = jsonWithCors(
      request,
      { error: PUBLIC_API_ERRORS.widgetConfigFailed },
      { status: 500 },
    );
    return finishPublicApiResponse(request, guard.ctx, response);
  }
}
