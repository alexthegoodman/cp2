import seedUsers from "./user";
import clean from "./clean";

import prisma from "../../lib/prisma";
import seedPosts from "./post";
import seedThreads from "./thread";
import seedInterests from "./interest";

async function main() {
  const { users } = await seedUsers();
  const { categories, interests } = await seedInterests();
  const { posts } = await seedPosts(users, interests);
  await seedPosts(users, interests);
  await seedPosts(users, interests);
  await seedPosts(users, interests);
  await seedPosts(users, interests);
  await seedPosts(users, interests);
  const { thread1, thread2 } = await seedThreads(users, posts);
}

clean()
  .catch((e) => console.error(e))
  .finally(async () => {
    console.info("cleaned");
    // reload
    main()
      .catch((e) => console.error(e))
      .finally(async () => {
        console.info("populated");
        await prisma.$disconnect();
      });
  });
