import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Utilities from "../../lib";

const utilities = new Utilities();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const credentials = utilities.helpers.parseAuthHeader(authHeader);
    const email = credentials[0];
    const password = credentials[1];

    if (!email || !password) {
      return res.status(400).json({ error: "Email or password missing" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
        const data = {
          userId: user.id,
          time: new Date(),
        };
        const token = jwt.sign(data, jwtSecretKey, { expiresIn: "7d" });

        return res.status(200).json({ token, userId: user.id });
      } else {
        return res.status(401).json({ error: utilities.ERROR_CODES.B003 });
      }
    } else {
      return res.status(401).json({ error: utilities.ERROR_CODES.C001 });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
