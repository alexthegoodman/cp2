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
  const { url } = req.body;

  try {
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";

    const pageview = await prisma.pageView.create({
      data: {
        url: url || "",
        ipAddress: ipAddress,
        city: "",
        geoData: "",
        userId: currentUser?.id || null,
      },
    });

    return res.status(201).json(pageview);
  } catch (error) {
    console.error("Create pageview error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
