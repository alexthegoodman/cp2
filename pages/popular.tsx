import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR, { SWRConfig } from "swr";
import { motion } from "framer-motion";
import Utilities from "@/lib";
import ContentViewer from "../components/post/ContentViewer/ContentViewer";
import PrimaryHeader from "../components/layout/PrimaryHeader/PrimaryHeader";
import PrimaryNavigation from "../components/layout/PrimaryNavigation/PrimaryNavigation";
import { useUnreadThreads } from "../hooks/useUnreadThreads";
import { PopularInterests } from "./interests";
import { NextSeo } from "next-seo";
import BrandName from "../components/layout/BrandName/BrandName";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import { useTranslation } from "next-i18next/pages";
import LanguagePicker from "../components/queue/LanguagePicker/LanguagePicker";
import Link from "next/link";
import { useRouter } from "next/router";
import Masonry from "react-responsive-masonry";
import useInfiniteScroll from "react-infinite-scroll-hook";
import apiClient from "../helpers/APIClient";
import InterestsSlider from "@/components/queue/PickerButton/InterestsSlider";
import nextI18nextConfig from "@/next-i18next.config";
import ContentInformation from "@/components/post/ContentInformation/ContentInformation";
import { useWindowSize } from "@uidotdev/usehooks";

const getPopularData = async (token, interestId = null, categoryId = null) => {
  let userData = null;
  if (token) {
    apiClient.setupClient(token);
    userData = await apiClient.get("/user");
  }

  console.info("getPopularData interestId", interestId, "categoryId", categoryId);

  const explorePostsData = await apiClient.get("/posts", {
    interestId,
    categoryId,
    page: 1,
  });

  let userThreadData = null;
  if (token) {
    userThreadData = await apiClient.get("/threads");
  }

  const categoriesAndInterestsData = await apiClient.get("/interests");

  let threads: any = [];
  if (Array.isArray(userThreadData)) {
    threads = userThreadData;
  }

  return {
    currentUser: userData,
    explorePosts: explorePostsData,
    threads,
    categoriesAndInterestsData,
  };
};

const PopularContent = ({ coUserLng, coFavInt, favoriteInterest, interestsByCategory }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["coUserToken", "coFavInt", "coPWA"]);
  const token = cookies.coUserToken;

  apiClient.setupClient(token);

  console.info("favoriteInterest", favoriteInterest);

  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data, mutate } = useSWR(
    ["popularKey", token, selectedInterest?.id, selectedCategory?.id],
    () => getPopularData(token, selectedInterest?.id, selectedCategory?.id),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    mutate();
  }, [selectedInterest, selectedCategory]);

  const [exploreHasMore, setExploreHasMore] = useState(true);
  const [explorePostsPage, setExplorePostsPage] = useState(1);
  const [explorePostsData, setExplorePostsData] = useState<any[]>([]);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(
    !coUserLng && token ? true : false
  );
  const [showFavoriteInterestModal, setShowFavoriteInterestModal] = useState(
    !coFavInt && token ? true : false
  );

  const loadMoreExploreItems = async () => {
    const newPage = explorePostsPage + 1;
    const addtPostsData = await apiClient.get("/posts", {
      interestId: selectedInterest?.id,
      categoryId: selectedCategory?.id,
      page: newPage,
    });

    console.info("popular explorePostsData", addtPostsData, explorePostsData);

    setExploreHasMore(
      addtPostsData.length === 20 ? true : false
    );
    setExplorePostsPage(newPage);
    setExplorePostsData([
      ...explorePostsData,
      ...addtPostsData,
    ]);
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: false,
    hasNextPage: exploreHasMore,
    onLoadMore: loadMoreExploreItems,
    rootMargin: "0px 0px 100px 0px",
  });

  useEffect(() => {
    setExplorePostsData(data?.explorePosts || []);
  }, [data]);

  const onCloseInterests = () => {
    setShowInterestsModal(false);
  };

  const onConfirmInterest = async (category, interest) => {
    setShowInterestsModal(false);
    setSelectedInterest(interest);
    setSelectedCategory(category);

    await mutate(() => getPopularData(token, interest?.id, category?.id));
  };

  const { unreadThreads, unreadThreadCount } = useUnreadThreads(
    data?.threads,
    data?.currentUser?.generatedUsername
  );

  const windowSize = useWindowSize();

  return (
    <>
      {showInterestsModal ? (
        <section
          className="fullModal"
          style={{
            zIndex: 100,
          }}
        >
          <PopularInterests
            title="Pick Interest"
            onBack={onCloseInterests}
            onConfirm={onConfirmInterest}
          />
        </section>
      ) : (
        <></>
      )}
      {showLanguageModal ? (
        <section
          className="fullModal"
          style={{
            zIndex: 90,
          }}
        >
          <LanguagePicker />
        </section>
      ) : (
        <></>
      )}
      {showFavoriteInterestModal ? (
        <section
          className="fullModal"
          style={{
            zIndex: 80,
          }}
        >
          <PopularInterests
            title={t("interests:ui.pickFavoriteInterest")}
            onConfirm={async (category, interest) => {
              await apiClient.post("/interests/favorite", {
                interestId: interest.id,
              });

              setCookie("coFavInt", interest.id);

              location.reload();
            }}
            showClear={false}
          />
        </section>
      ) : (
        <></>
      )}
      
      <section className="queue">
        <div className="queueInner">
          <NextSeo title={`Popular | CommonPlace`} />
          <section className="desktopOnly">
            <InterestsSlider
              interestsByCategory={interestsByCategory}
              selectedInterest={selectedInterest}
              selectedCategory={selectedCategory}
              onSelectInterest={onConfirmInterest}
            />
          </section>
          <PrimaryHeader
            leftIcon={
              <div className="leftHeaderContainer">
                <BrandName />
                <PrimaryNavigation
                  className="desktopOnly"
                  threadCount={unreadThreadCount}
                />
              </div>
            }
            titleComponent={
              <div className="mobileOnly">
                <InterestsSlider
                  interestsByCategory={interestsByCategory}
                  selectedInterest={selectedInterest}
                  selectedCategory={selectedCategory}
                  onSelectInterest={onConfirmInterest}
                />
              </div>
            }
            rightIcon={
              <PrimaryNavigation
                className="mobileOnly"
                threadCount={unreadThreadCount}
              />
            }
          />
          <motion.div
            className="animationContainer"
            initial={{ opacity: 1 }}
            ref={rootRef}
            style={{ 
              paddingTop: "65px",
              paddingBottom: "85px", 
              // paddingLeft: "90px",
              paddingLeft: windowSize.width > 600 ? "90px" : "0px",
              overflowY: "auto", 
              height: "calc(100vh - 80px)",
              margin: "0 10px"
            }}
          >
            <Masonry columnsCount={windowSize.width > 600 ? 4 : 2} gutter={windowSize.width > 600 ? "12px" : "4px"}>
              {explorePostsData?.map((post) => (
                // <Link
                //   key={post.id}
                //   href={`/post/${post?.interest?.generatedInterestSlug}/${post?.generatedTitleSlug}`}
                //   style={{ display: "block", textDecoration: "none" }}
                // >
                <div>
                  <ContentViewer
                    alt={post?.title || ""}
                    type={post.contentType}
                    preview={post.contentPreview}
                    content={post.content}
                    mini={true}
                  />
                  <ContentInformation queue={true} post={post} bottomSpacing={false} />
                </div>
                // </Link>
              ))}
            </Masonry>
            <div className="sentry" ref={sentryRef} style={{ height: "40px" }}></div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Popular: NextPage<{
  fallback: any;
  coUserLng: string;
  coFavInt: string;
  favoriteInterest: string;
}> = ({ fallback, coUserLng, coFavInt, favoriteInterest, interestsByCategory }) => {
  return (
    <SWRConfig
      value={{ fallback, revalidateOnMount: true, refreshWhenHidden: true }}
    >
      <PopularContent
        coUserLng={coUserLng}
        coFavInt={coFavInt}
        favoriteInterest={favoriteInterest}
        interestsByCategory={interestsByCategory}
      />
    </SWRConfig>
  );
};

export default Popular;

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);
  const token = cookieData.coUserToken;

  const favoriteInterestId =
    typeof cookieData.coFavInt !== "undefined" ? cookieData.coFavInt : null;

  const returnData = await getPopularData(token, favoriteInterestId);

  const category = returnData.categoriesAndInterestsData.getCategories.filter(
    (category) =>
      category.interests ? category.interests.filter(
        (interest) => interest.id === favoriteInterestId
      )[0] : null
  )[0];
  const interest =
    typeof category !== "undefined"
      && category.interests ? category.interests.filter(
          (interest) => interest.id === favoriteInterestId
        )[0]
      : null;

  const locale =
    typeof cookieData.coUserLng !== "undefined"
      ? cookieData.coUserLng
      : context.locale;

  return {
    props: {
      coUserLng:
        typeof cookieData.coUserLng !== "undefined"
          ? cookieData.coUserLng
          : null,
      interestsByCategory: returnData.categoriesAndInterestsData.getCategories,
      coFavInt: favoriteInterestId,
      favoriteInterest: interest,
      ...(await serverSideTranslations(
        locale,
        ["interests", "impressions", "settings", "common"],
        nextI18nextConfig
      )),
      fallback: {
        popularKey: returnData,
      },
    },
  };
}
