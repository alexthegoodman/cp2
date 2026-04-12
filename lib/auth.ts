import jwt from "jsonwebtoken";
import prisma from "./prisma";

export const verifyToken = async (req) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "Authorization";
  const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
  let currentUser = null;

  try {
    const tokenHeader = req.headers[tokenHeaderKey.toLowerCase()];
    const token = Array.isArray(tokenHeader) ? tokenHeader[0]?.split("Bearer ")[1] : tokenHeader?.split("Bearer ")[1];

    if (token) {
      const verified = jwt.verify(token, jwtSecretKey) as any;

      if (verified && verified.userId) {
        currentUser = await prisma.user.findFirst({
          where: {
            id: verified.userId,
          },
        });
      }
    }
  } catch (error) {
    console.warn("Token Not Verified", error.message);
  }

  return currentUser;
};
