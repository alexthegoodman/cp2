import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";
import AWS from "../../../lib/AWS";
import Utilities from "../../../lib";

const utilities = new Utilities();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await verifyToken(req);

  if (req.method === "GET") {
    const { mode, interestId, page = "1" } = req.query;
    const p = parseInt(page as string) || 1;

    try {
      let posts = [];
      let whereClause: any = {};

      if (interestId) {
        whereClause.interestId = interestId as string;
      }

      if (mode === "queue" && currentUser) {
        posts = await prisma.post.findMany({
          where: {
            creatorId: { not: currentUser.id },
            messages: {
              none: {
                userId: currentUser.id,
                type: "impression",
              },
            },
            ...whereClause,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        });
      } else {
        // Default: Explore
        posts = await prisma.post.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: 20 * (p - 1),
        });
      }

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Fetch posts error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const {
        interestId,
        contentType,
        title,
        description,
        text,
        file1Name,
        file1Size,
        file1Type,
        file1Data,
        file2Name,
        file2Size,
        file2Type,
        file2Data,
      } = req.body;

      const interest = await prisma.interest.findUnique({
        where: { id: interestId },
        include: { posts: true },
      });

      if (interest && interest.posts.length > 5) {
        const newCredit = (currentUser.credit as number) - 3;
        if (newCredit < 0) {
          return res.status(400).json({ error: "Not enough credits" });
        }
        await prisma.user.update({
          where: { id: currentUser.id },
          data: { credit: newCredit },
        });
      }

      const aws = new AWS();
      let upload1Path = "";
      if (file1Name && file1Data) {
        upload1Path = await aws.uploadAsset(contentType, file1Name, file1Type, file1Size, file1Data);
      }

      let upload2Path = "";
      if (file2Name && file2Data) {
        upload2Path = await aws.uploadAsset("image", file2Name, file2Type, file2Size, file2Data);
      }

      const generatedTitleSlug = utilities.helpers.slugify(title);

      let contentData = {
        contentPreview: upload2Path,
        content: upload1Path,
      };

      if (contentType === "text" && text) {
        contentData = {
          contentPreview: "",
          content: text,
        };
      }

      const post = await prisma.post.create({
        data: {
          title,
          description,
          generatedTitleSlug,
          contentType,
          ...contentData,
          interest: { connect: { id: interestId } },
          creator: { connect: { id: currentUser.id } },
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
