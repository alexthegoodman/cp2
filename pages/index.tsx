import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Utilities from "@/lib";
import prisma from "@/lib/prisma";
import { cpDomain } from "../def/urls";
import LandingBlockA from "../components/landing/LandingBlockA/LandingBlockA";
import LandingFeaturesA from "../components/landing/LandingFeaturesA/LandingFeaturesA";
import LandingHeroA from "../components/landing/LandingHeroA/LandingHeroA";
import LandingRecentPosts from "../components/landing/LandingRecentPosts/LandingRecentPosts";
import LandingSocialProof from "../components/landing/LandingSocialProof";
import LandingFooter from "../components/landing/LandingFooter";
import LandingInterests from "../components/landing/LandingInterests";
import LandingFAQ from "../components/landing/LandingFAQ";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import apiClient from "../helpers/APIClient";
import { CookieSettings } from "./settings";

const Home: NextPage<any> = ({ recentPosts = [], categories = [] }) => {
  const canonicalUrl = "https://" + cpDomain;
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["coUserToken"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const utilities = new Utilities();
      const rand = nanoid(8);
      const email = `guest-${rand}@commonplace.exchange`;
      const password = `guest-pass-${rand}`;

      const authorizationHeader = utilities.helpers.createAuthHeader(
        `${email}:${password}`
      );

      const response = await apiClient.post(
        "/user",
        {},
        {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      );

      const token = response.token;

      const expireCookie = DateTime.now()
        .plus({ weeks: 1 })
        .endOf("day")
        .toUTC()
        .toJSDate();

      setCookie("coUserToken", token, {
        ...CookieSettings,
        expires: expireCookie,
      });

      router.push("/queue");
    } catch (error) {
      console.error("Guest login failed:", error);
      alert("Something went wrong during guest login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="landingContainer">
      <NextSeo
        title={`CommonPlace | Get Free Feedback on Art, Music, Writing`}
        description={`Get free feedback and reviews on all kinds of hobbies (art, music, writing, and more) while networking with other hobbyists on CommonPlace.`}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: `Get Free Feedback on Art, Music, Writing, and more on CommonPlace`,
          description: "CommonPlace helps people exchange feedback on each others content!",
          images: [{ url: "/ogImage1.jpg" }],
          site_name: "CommonPlace",
        }}
      />
      <LandingHeroA
        title={<strong>Get feedback on what you do</strong>}
        description={
          <p>
            CommonPlace enables creators and hobbyists to learn what others
            think, for free! Join today by signing up below:
          </p>
        }
        visualUrl="/landing/productArtEnglish.png"
      >
        <>
          
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="button"
          >
            {isLoading ? "Loading..." : "Use as Guest"}
          </button>
          <a href="/sign-up" className="guestButton ">
            Create Account
          </a>
          {/* <LandingSocialProof /> */}
          <span style={{ display: "block", marginTop: "16px" }}>Or <a href="/sign-in">
            Sign In
          </a></span>
          
        </>
      </LandingHeroA>
      
      <LandingFeaturesA
        headline="Gather honest opinions"
        description={
          <>
            <p>
              CommonPlace is simple. Review to upload. If you review 3 posts,
              you can upload your own. Everything from music and research papers
              to poems and calligraphy.
            </p>
            <p>There's an option for anything you do or create.</p>
          </>
        }
        features={[
          {
            image: "/landing/mailchimp2-small.jpg",
            headline: "Review 3 posts",
            description:
              "Simply find the posts that are most relevant to you and begin reviewing them.",
          },
          {
            image: "/landing/mailchimp3-small.jpg",
            headline: "Upload your own",
            description:
              "Once you have earned enough points, you're free to upload your own image, video, image, or text.",
          },
          {
            image: "/landing/mailchimp4-small.jpg",
            headline: "Know where you stand",
            description:
              "Get feedback on everything from music and research papers to paintings and poems.",
          },
        ]}
      />
      <LandingRecentPosts posts={recentPosts} />
      <LandingBlockA
        headline="Grow your audience"
        description={
          <p>
            Connect with the others who review your work and grow your audience
            online. Network with like minded people and open the door to new
            opportunities.
          </p>
        }
      />
      <LandingInterests categories={categories} />
      <LandingFAQ />
      <LandingFooter />
    </main>
  );
};

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);
  const token = cookieData.coUserToken;

  if (token) {
    return {
      redirect: {
        destination: "/queue",
        permanent: false,
      },
    };
  }

  const [recentPosts, categories] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        interest: true,
        creator: true,
      },
    }),
    prisma.category.findMany({
      // take: 5,
      include: {
        interests: {
          take: 3
        }
      }
    })
  ]);

  return {
    props: {
      recentPosts: JSON.parse(JSON.stringify(recentPosts)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}

export default Home;
