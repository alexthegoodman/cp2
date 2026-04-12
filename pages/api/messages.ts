import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { verifyToken } from "../../lib/auth";

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

  const { content, threadId } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        type: "reply",
        content: content,
        userId: currentUser.id,
        threadId: threadId
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
