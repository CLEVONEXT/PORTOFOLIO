import { handlers } from "@/lib/auth";
import { authSecret } from "@/lib/auth.config";

function missingSecretResponse() {
	return Response.json(
		{ error: "AUTH_CONFIGURATION_MISSING", message: "Set NEXTAUTH_SECRET or AUTH_SECRET in the deployment environment." },
		{ status: 503 },
	);
}

export const GET: typeof handlers.GET = async (...args) =>
	authSecret ? handlers.GET(...args) : missingSecretResponse();

export const POST: typeof handlers.POST = async (...args) =>
	authSecret ? handlers.POST(...args) : missingSecretResponse();
