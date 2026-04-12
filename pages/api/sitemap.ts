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
    const users = await prisma.user.findMany({
      select: {
        chosenUsername: true,
        generatedUsername: true,
      },
    });

    const posts = await prisma.post.findMany({
      select: {
        generatedTitleSlug: true,
        interest: {
          select: {
            generatedInterestSlug: true,
          },
        },
      },
    });

    const profileURLs = users.map(
      (user) => `/co/${user.chosenUsername || user.generatedUsername}`
    );
    
    const postURLs = posts.map(
      (post) => `/post/${post.interest.generatedInterestSlug}/${post.generatedTitleSlug}`
    );

    return res.status(200).json({
      getProfileURLs: profileURLs,
      getPostURLs: postURLs,
    });
  } catch (error) {
    console.error("Sitemap API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
