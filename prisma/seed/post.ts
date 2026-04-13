import prisma from "../../lib/prisma";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { nanoid } from "nanoid";

// export const cloudfrontUrl = "https://d3ubks77jdbtp7.cloudfront.net";

export const testImages = [
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/adrianna-geo-1rBg5YSi00c-unsplash.jpg",
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/boston-public-library-YoK5pBcSY8s-unsplash.jpg",
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/dan-farrell-fT49QnFucQ8-unsplash.jpg",
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/adrianna-geo-1rBg5YSi00c-unsplash.jpg",
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/boston-public-library-YoK5pBcSY8s-unsplash.jpg",
  "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/dan-farrell-fT49QnFucQ8-unsplash.jpg",
];

export default async function seedPosts(users, interests) {
  await prisma.post.createMany({
    data: [
      {
        title: "The Willow House",
        description:
          "As shifting forms become distorted through emergent and critical practice, the viewer is left with an epitaph for the outposts of our era.",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("The Willow House") + nanoid(),
        content: testImages[0],
        interestId: interests.filter(
          (interest) => interest.name === "Painting"
        )[0].id,
        creatorId: users[1].id,
      },
      {
        title: "Chinese Stir Fry",
        description: "It builds depth and complexity",
        contentType: "video",
        contentPreview: "",
        generatedTitleSlug: slugify("Chinese Stir Fry") + nanoid(),
        content: "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetah.mp4",
        interestId: interests.filter(
          (interest) => interest.name === "Chinese"
        )[0].id,
        creatorId: users[2].id,
      },
      {
        title: "Like a Starry Night",
        description: "",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("Like a Starry Night") + nanoid(),
        content: testImages[1],
        interestId: interests.filter(
          (interest) => interest.name === "Painting"
        )[0].id,
        creatorId: users[3].id,
      },
      {
        title: "Tuesday (GlitchSoftHip-hop)",
        description:
          "My work explores the relationship between Critical theory and UFO sightings.",
        contentType: "audio",
        contentPreview: "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetahPoster.jpeg",
        generatedTitleSlug: slugify("Tuesday (GlitchSoftHip-hop)") + nanoid(),
        content:
          "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetah.mp3",
        interestId: interests.filter(
          (interest) => interest.name === "Electronic"
        )[0].id,
        creatorId: users[4].id,
      },
      {
        title: "The Elements as One",
        description:
          "The Elements explores the relationship between earth, wind, and sea.",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("The Elements as One") + nanoid(),
        content: testImages[2],
        interestId: interests.filter(
          (interest) => interest.name === "Drawing"
        )[0].id,
        creatorId: users[5].id,
      },
      {
        title: "Chop Master!",
        description: "Chopping some food. Hope you like",
        contentType: "video",
        contentPreview: "",
        generatedTitleSlug: slugify("Chop Master!") + nanoid(),
        content: "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetah.mp4",
        interestId: interests.filter(
          (interest) => interest.name === "Cooking"
        )[0].id,
        creatorId: users[6].id,
      },
      {
        title: "Happy Flower",
        description: "",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("Happy Flower") + nanoid(),
        content: testImages[3],
        interestId: interests.filter(
          (interest) => interest.name === "Drawing"
        )[0].id,
        creatorId: users[7].id,
      },
      {
        title: "The Blackest Bouquet",
        description:
          "As momentary derivatives become clarified through emergent and repetitive practice, the viewer is left with a testament to the darkness of our existence.",
        contentType: "audio",
        contentPreview: "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetahPoster.jpeg",
        generatedTitleSlug: slugify("audio #2") + nanoid(),
        content:
          "https://zg8kcksribtynhwp.public.blob.vercel-storage.com/cheetah.mp3",
        interestId: interests.filter(
          (interest) => interest.name === "Electronic"
        )[0].id,
        creatorId: users[8].id,
      },
      {
        title: "Practice 03",
        description: "",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("Practice 03") + nanoid(),
        content: testImages[4],
        interestId: interests.filter(
          (interest) => interest.name === "Cricket"
        )[0].id,
        creatorId: users[9].id,
      },
      {
        title: "Practice 04",
        description: "",
        contentType: "image",
        contentPreview: "",
        generatedTitleSlug: slugify("Practice 04") + nanoid(),
        content: testImages[5],
        interestId: interests.filter(
          (interest) => interest.name === "Cricket"
        )[0].id,
        creatorId: users[9].id,
      },
      // {
      //   ...getDefaultPost(0, 0),
      //   contentType: "video",
      //   contentPreview: "", // TODO: add for video?
      //   content: "http://localhost:3000/test/cheetah.mp4",
      // },
      // {
      //   ...getDefaultPost(1, 0),
      //   contentType: "image",
      //   contentPreview: "",
      //   content: "http://localhost:3000/test/cheetahPoster.jpeg",
      // },
      // {
      //   ...getDefaultPost(1, 0),
      //   contentType: "audio",
      //   contentPreview: "http://localhost:3000/test/cheetahPoster.jpeg",
      //   content: "http://localhost:3000/test/cheetah.mp3",
      // },
      // {
      //   ...getDefaultPost(),
      //   contentType: "text",
      //   contentPreview: "",
      //   content: `greetings \n\nthis is a poem \n\nwith many words of kindness and wishes of wisdom \nand good things \n\nthank you`,
      // },
    ],
  });

  const posts = await prisma.post.findMany();

  return {
    posts,
  };
}
