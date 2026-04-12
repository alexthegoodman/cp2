// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemapLegacy } from "next-sitemap";
import { GetServerSideProps } from "next";
import apiClient from "../../helpers/APIClient";

const getURLData = async () => {
  const data = await apiClient.get("/sitemap");

  const returnData = [...data.getProfileURLs, ...data.getPostURLs];

  return returnData;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const urlData = await getURLData();

  // TODO: home page (pre-sign-in), landing pages, about page, etc

  console.info("urlData", urlData);

  const fields = urlData.map((url, i) => {
    return {
      loc: "https://commonplace.social" + url, // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    };
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
