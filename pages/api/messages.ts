import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { verifyToken } from "../../lib/auth";
import VBlob from "../../lib/VBlob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const currentUser = await verifyToken(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    content,
    threadId,
    attachmentUrl,
    fileData,
    fileName,
    fileType,
    fileSize,
  } = req.body;

  let finalAttachmentUrl = attachmentUrl;

  if (fileData && fileName && !finalAttachmentUrl) {
    const vblob = new VBlob();
    let contentType = "image";
    if (fileType?.includes("video")) contentType = "video";
    if (fileType?.includes("audio")) contentType = "audio";

    try {
      finalAttachmentUrl = await vblob.uploadAsset(
        contentType,
        fileName,
        fileType,
        fileSize,
        fileData
      );
    } catch (uploadError) {
      console.error("Upload error in messages API:", uploadError);
    }
  }

  try {
    const message = await prisma.message.create({
      data: {
        type: "reply",
        content: content || "",
        userId: currentUser.id,
        threadId: threadId,
        attachmentUrl: finalAttachmentUrl,
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
