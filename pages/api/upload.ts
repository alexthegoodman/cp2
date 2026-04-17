import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const body = (request.body as HandleUploadBody);

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate the user
        const currentUser = await verifyToken(request);
        if (!currentUser) throw new Error("Unauthenticated");

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/quicktime",
            "video/webm",
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            "audio/mp4",
          ],
          tokenPayload: JSON.stringify({
            userId: currentUser.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This callback is called once the upload is completed.
        // The edge function will call this with a POST request.
        console.info("blob upload completed", blob, tokenPayload);

        try {
          const { userId } = JSON.parse(tokenPayload);
          console.info(`User ${userId} uploaded ${blob.url}`);
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    // The client will also get this error
    return response.status(400).json({
      error: (error as Error).message,
    });
  }
}
