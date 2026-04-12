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

  const { name, content, threadId } = req.body;

  try {
    const record = await prisma.record.create({
      data: {
        name,
        content,
        threadId: threadId
      }
    });

    return res.status(201).json(record);
  } catch (error) {
    console.error("Create record error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
