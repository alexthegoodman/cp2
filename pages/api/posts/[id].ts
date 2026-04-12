import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // id can be UUID or generatedTitleSlug
  const currentUser = await verifyToken(req);

  if (req.method === "GET") {
    try {
      const post = await prisma.post.findFirst({
        where: {
          OR: [
            { id: id as string },
            { generatedTitleSlug: id as string }
          ]
        },
        include: {
          creator: {
            select: {
              id: true,
              chosenUsername: true,
              profileImage: true
            }
          },
          interest: true,
          messages: {
            where: { type: "impression" },
            include: {
              user: {
                select: {
                  id: true,
                  chosenUsername: true,
                  profileImage: true
                }
              }
            },
            orderBy: { createdAt: "desc" }
          }
        }
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Map messages to impressions to match frontend expectation
      const postWithImpressions = {
        ...post,
        impressions: post.messages
      };

      return res.status(200).json(postWithImpressions);
    } catch (error) {
      console.error("Fetch post error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { title, description } = req.body;

      const post = await prisma.post.findFirst({
        where: {
          OR: [
            { id: id as string },
            { generatedTitleSlug: id as string }
          ]
        }
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.creatorId !== currentUser.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: {
          title: title || post.title,
          description: description || post.description
        }
      });

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Update post error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const post = await prisma.post.findFirst({
        where: {
          OR: [
            { id: id as string },
            { generatedTitleSlug: id as string }
          ]
        }
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.creatorId !== currentUser.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.post.delete({
        where: { id: post.id }
      });

      return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      console.error("Delete post error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
