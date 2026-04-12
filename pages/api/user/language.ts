import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

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

  const { language } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        language: language
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user language error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
