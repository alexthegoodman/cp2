import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        interests: {
          include: {
            posts: {
              take: 10 // Optional: limit to avoid heavy payload
            }
          }
        }
      }
    });
    return res.status(200).json({ getCategories: categories });
  } catch (error) {
    console.error("Fetch interests error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
