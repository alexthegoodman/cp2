export const env = process.env.NEXT_PUBLIC_APP_ENV;

export const protocol = env === "production" ? "https://" : "http://";

export const cookieDomain =
  env === "production" ? "commonplace-platform.vercel.app" : "localhost";

export const cpDomain =
  env === "production"
    ? "commonplace-platform.vercel.app"
    : process.env.NEXT_PUBLIC_DOCKER_HOST;

export const cpDomainwp =
  env === "production"
    ? "commonplace-platform.vercel.app"
    : process.env.NEXT_PUBLIC_DOCKER_HOST + ":3000";

export const cpGraphqlUrl =
  env === "production"
    ? "https://commonplace-platform.vercel.app:4000/graphql"
    : `http://${process.env.NEXT_PUBLIC_DOCKER_HOST}:4000/graphql`;
