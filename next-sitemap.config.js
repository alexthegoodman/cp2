/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://commonplace-platform.vercel.app",
  generateRobotsTxt: true, // (optional)
  sitemapSize: 5000,
  exclude: ["/server-sitemap.xml"], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://commonplace-platform.vercel.app/server-sitemap.xml", // <==== Add here
    ],
  },
  // ...other options
};

module.exports = config;
