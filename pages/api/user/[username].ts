import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { chosenUsername: username as string },
          { generatedUsername: username as string }
        ]
      },
      include: {
        posts: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ getUser: user });
  } catch (error) {
    console.error("Fetch user by username error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
