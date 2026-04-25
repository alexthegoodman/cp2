
import type { NextPage } from "next";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import { useCookies } from "react-cookie";

import Utilities from "@/lib";
import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";
import UpdateItem from "../../components/updates/UpdateItem/UpdateItem";
import { useUnreadThreads } from "../../hooks/useUnreadThreads";
import { NextSeo } from "next-seo";
import InviteFriends from "../../components/growth/InviteFriends/InviteFriends";
import DesktopNavigation from "../../components/layout/DesktopNavigation/DesktopNavigation";
import { GQLClient } from "@/lib/GQLClient";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js";
import { appWithTranslation, useTranslation } from "next-i18next/pages";
import apiClient from "../../helpers/APIClient";

import { useMemo, useState } from "react";

const getUserThreadData = async (token) => {
  apiClient.setupClient(token);

  const userData = await apiClient.get("/user");
  const userThreadData = await apiClient.get("/threads");

  return {
    getUser: userData,
    getUserThreads: userThreadData,
  };
};

const UpdatesContent: NextPage = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["coUserToken"]);
  const token = cookies.coUserToken;
  const [filter, setFilter] = useState("all");

  const { data } = useSWR("updatesKey", () => getUserThreadData(token), {
    revalidateIfStale: true,
  });

  const { unreadThreads, unreadThreadCount } = useUnreadThreads(
    data?.getUserThreads,
    data?.getUser?.generatedUsername
  );

  const userPosts = useMemo(() => {
    return data?.getUser.posts;
  }, [data?.getUser])

  // const filteredThreads =
  //   filter === "unread"
  //     ? data?.getUserThreads?.filter((thread) =>
  //         unreadThreads.some((unread) => unread.id === thread.id)
  //       )
  //     : data?.getUserThreads;

  // const threadsPosts = useMemo(() => {
  //   const ids = new Set<string>();

  //   const posts = data?.getUserThreads.flatMap((thread) =>
  //     thread?.messages.map((mes) => mes?.post)
  //   ) ?? [];

  //   return posts.filter((post): post is NonNullable<typeof post> => {
  //     if (!post?.id || ids.has(post.id)) return false;
  //     ids.add(post.id);
  //     return true;
  //   });
  // }, [data?.getUserThreads]);

  const { threadsPosts, postIds } = useMemo(() => {
    const ids = new Set<string>();

    const posts = data?.getUserThreads.flatMap((thread) =>
      thread?.messages.map((mes) => mes?.post)
    ) ?? [];

    const filteredPosts = posts.filter((post): post is NonNullable<typeof post> => {
      if (!post?.id || ids.has(post.id)) return false;
      ids.add(post.id);
      return true;
    });

    return { threadsPosts: filteredPosts, postIds: ids };
  }, [data?.getUserThreads]);

  const filteredThreads = useMemo(() =>
    (filter === "unread"
      ? data?.getUserThreads?.filter((thread) =>
          unreadThreads.some((unread) => unread.id === thread.id)
        )
      : data?.getUserThreads
    )?.filter((thread) =>
      thread?.messages.some((mes) => mes?.post?.id && postIds.has(mes.post.id))
    ),
    [data?.getUserThreads, filter, unreadThreads, postIds]
  );

  console.info("UpdatesContent", data, threadsPosts);

  return (
    <section className="updates">
      <div className="updatesInner">
        <NextSeo title={`Updates | CommonPlace`} />
        <PrimaryHeader
          inline={true}
          leftIcon={
            <>
              <DesktopNavigation />
              <Link className="mobileOnly" aria-label="Go Back to Queue" href="/queue">
                  <i className="typcn typcn-equals"></i>
              </Link>
            </>
          }
          title={t("updates:title")}
          rightIcon={<></>}
        />
        <InviteFriends />
        {threadsPosts?.length > 0 ? (
          <div className="updatesFilters">
            {threadsPosts?.map((post, i) => {
              return (<button
                className={`filterButton ${filter === post.id ? "active" : ""}`}
                onClick={() => setFilter(post.id)}
              >
                {post.title}
              </button>)
            })}
          </div>
        ) : <></>}
        {/* <div className="updatesFilters">
          <button
            className={`filterButton ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("updates:filters.all")}
          </button>
          <button
            className={`filterButton ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            {t("updates:filters.unread")}
            {unreadThreadCount > 0 && (
              <span className="unreadCount">{unreadThreadCount}</span>
            )}
          </button>
        </div> */}
        <div className="scrollContainer updatesContainer">
          {filteredThreads?.length > 0 ? (
            filteredThreads?.map((thread, i) => {
              const previewMessage = thread.messages[0];

              const match = unreadThreads.find(
                (unread, z) => unread.id === thread.id
              );

              return (
                <UpdateItem
                  key={`updateItem${i}`}
                  id={thread.id}
                  label={previewMessage.content}
                  author={previewMessage?.user}
                  isRead={match ? false : true}
                  createdAt={previewMessage?.createdAt}
                />
              );
            })
          ) : (
            <div className="emptyMessage">
              <span>{t("common:empty.updates")}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Updates: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig
      value={{ fallback, revalidateOnMount: true, refreshWhenHidden: true }}
    >
      <UpdatesContent />
    </SWRConfig>
  );
};

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);
  const token = cookieData.coUserToken;

  // console.info("token", token);

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const userThreadData = await getUserThreadData(token);

  // console.info("getServerSideProps", userThreadData);

  const locale =
    typeof cookieData.coUserLng !== "undefined"
      ? cookieData.coUserLng
      : context.locale;

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["updates", "common"],
        nextI18NextConfig
      )),
      fallback: {
        updatesKey: userThreadData,
      },
    },
  };
}

export default Updates;
