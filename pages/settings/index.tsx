import type { NextPage } from "next";
import { appWithTranslation, useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Utilities from "@/lib";
import { cookieDomain } from "../../def/urls";
import DesktopNavigation from "../../components/layout/DesktopNavigation/DesktopNavigation";

import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";

export const CookieSettings = {
  sameSite: "strict" as "strict",
  domain: cookieDomain,
  secure: true, // only accessible via https
  path: "/",
};

const Settings: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["coUserToken"]);

  const signOut = () => {
    removeCookie("coUserToken", {
      ...CookieSettings,
    });
    router.push("/sign-in");
  };

  return (
    <section className="settings">
      <div className="settingsInner">
        <NextSeo title={`Settings | CommonPlace`} />
        <PrimaryHeader
          inline={true}
          leftIcon={
            <>
              <DesktopNavigation />
              <Link href="/profile" className="mobileOnly">
                  <i className="typcn typcn-arrow-left"></i>
              </Link>
            </>
          }
          title={t("settings:title")}
          rightIcon={<></>}
        />
        <section className="settingsList">
          <div className="settingsListInner">
            <Link href="/settings/update-profile/">
              {t("settings:updateProfile")}
            </Link>
            {/* <Link href="/settings/change-password/">
              Change Password
            </Link> */}
            <Link href="/policies/">
              {t("settings:policies")}
            </Link>
            <a href="mailto:admin@commonplace.social">
              {t("settings:contactSupport")}
            </a>
            <div className="bottomLinks">
              <a href="#!" onClick={signOut}>
                {t("auth:signOut")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);

  const locale =
    typeof cookieData.coUserLng !== "undefined"
      ? cookieData.coUserLng
      : context.locale;

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["settings", "auth", "common"],
        nextI18NextConfig
      )),
    },
  };
}

export default Settings;
