import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import Utilities from "../../lib";
import { verifyToken } from "../../lib/auth";
import VBlob from "@/lib/VBlob";

const utilities = new Utilities();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await verifyToken(req);

  if (req.method === "GET") {
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userWithPosts = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        posts: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return res.status(200).json(userWithPosts);
  }

  if (req.method === "POST") {
    // Register User
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

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hash = await bcrypt.hash(password, 12);
      const generatedUsername = utilities.helpers.emailToUsername(email);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hash,
          generatedUsername,
          chosenUsername: generatedUsername,
          role: "USER",
        },
      });

      const jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";
      const token = jwt.sign({ userId: newUser.id, time: new Date() }, jwtSecretKey, { expiresIn: "7d" });

      return res.status(201).json({ token, userId: newUser.id });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    // Update Profile
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const {
        username,
        profileImageName,
        profileImageSize,
        profileImageType,
        profileImageData,
        coverImageName,
        coverImageSize,
        coverImageType,
        coverImageData,
      } = req.body;

      const vblob = new VBlob();
      let addtData: any = {};

      if (profileImageName && profileImageData) {
        addtData.profileImage = await vblob.uploadAsset(
          "image",
          profileImageName,
          profileImageType,
          profileImageSize,
          profileImageData
        );
      }

      if (coverImageName && coverImageData) {
        addtData.coverImage = await vblob.uploadAsset(
          "image",
          coverImageName,
          coverImageType,
          coverImageSize,
          coverImageData
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          chosenUsername: username || currentUser.chosenUsername,
          ...addtData,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
