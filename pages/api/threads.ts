import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { verifyToken } from "../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const currentUser = await verifyToken(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const threads = await prisma.thread.findMany({
      where: {
        users: { some: { id: currentUser.id } },
        messages: {
          some: { userId: { not: currentUser.id } }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            chosenUsername: true,
            profileImage: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            user: true
          }
        },
        readHistory: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json(threads);
  } catch (error) {
    console.error("Fetch threads error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
