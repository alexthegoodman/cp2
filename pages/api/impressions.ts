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

  const { content, postId } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { creator: true }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a thread for the impression if it doesn't exist, or find existing
    // For simplicity, let's create a Message of type 'impression'
    // In the original, it seems it creates a Message and potentially a Thread.
    
    // Find or create thread between currentUser and post.creator
    let thread = await prisma.thread.findFirst({
      where: {
        AND: [
          { users: { some: { id: currentUser.id } } },
          { users: { some: { id: post.creatorId } } }
        ]
      }
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          repliesAllowed: true,
          users: {
            connect: [
              { id: currentUser.id },
              { id: post.creatorId }
            ]
          }
        }
      });
    }

    const message = await prisma.message.create({
      data: {
        type: "impression",
        content: content,
        userId: currentUser.id,
        threadId: thread.id,
        postId: post.id
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Create impression error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
