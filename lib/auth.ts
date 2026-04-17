import jwt from "jsonwebtoken";
import prisma from "./prisma";

export const verifyToken = async (req) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "Authorization";
  const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
  let currentUser = null;

  try {
    const tokenHeader = req.headers[tokenHeaderKey.toLowerCase()];
    let token = Array.isArray(tokenHeader) ? tokenHeader[0]?.split("Bearer ")[1] : tokenHeader?.split("Bearer ")[1];

    if (!token && req.headers.cookie) {
      // Fallback to cookie
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      token = cookies["coUserToken"];
    }

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
