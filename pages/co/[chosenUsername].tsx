
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import Utilities from "@/lib";
import nextI18nextConfig from "../../next-i18next.config";
import { ProfileContent } from "../profile";
import apiClient from "../../helpers/APIClient";

const getUserAndPostsByUsernameData = async (chosenUsername) => {
  const data = await apiClient.get(`/user/${chosenUsername}`);

  return data;
};

const CoProfileDataWrapper = () => {
  const router = useRouter();
  const { chosenUsername } = router.query;

  const { data } = useSWR("coProfileKey", () =>
    getUserAndPostsByUsernameData(chosenUsername)
  );

  return <ProfileContent data={data} />;
};

const CoProfile: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig
      value={{ fallback, revalidateOnMount: true, refreshWhenHidden: true }}
    >
      <CoProfileDataWrapper />
    </SWRConfig>
  );
};

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);

  const { chosenUsername } = context.query;
  const userAndPostsData = await getUserAndPostsByUsernameData(chosenUsername);

  const locale =
    typeof cookieData.coUserLng !== "undefined"
      ? cookieData.coUserLng
      : context.locale;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"], nextI18nextConfig)),
      fallback: {
        coProfileKey: userAndPostsData,
      },
    },
  };
}

export default CoProfile;
