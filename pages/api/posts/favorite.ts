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

  const { postId } = req.body;

  try {
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: currentUser.id,
        postId: postId
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return res.status(200).json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          user: { connect: { id: currentUser.id } },
          post: { connect: { id: postId } }
        }
      });
      return res.status(200).json({ favorited: true });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
