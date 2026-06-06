export const env = process.env.NEXT_PUBLIC_APP_ENV;

export const protocol = env === "production" ? "https://" : "http://";

export const cookieDomain =
  env === "production" ? "commonplace.exchange" : "localhost";

export const cpDomain =
  env === "production"
    ? "commonplace.exchange"
    : process.env.NEXT_PUBLIC_DOCKER_HOST;

export const cpDomainwp =
  env === "production"
    ? "commonplace.exchange"
    : process.env.NEXT_PUBLIC_DOCKER_HOST + ":3000";

export const cpGraphqlUrl =
  env === "production"
    ? "https://commonplace.exchange:4000/graphql"
    : `http://${process.env.NEXT_PUBLIC_DOCKER_HOST}:4000/graphql`;

export const fullUrl = protocol + cookieDomain;
