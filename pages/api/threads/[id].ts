import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

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

  const { id } = req.query;

  try {
    const thread = await prisma.thread.findFirst({
      where: {
        id: id as string,
        users: { some: { id: currentUser.id } }
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
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                chosenUsername: true,
                profileImage: true
              }
            }
          }
        }
      }
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.status(200).json(thread);
  } catch (error) {
    console.error("Fetch thread error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
