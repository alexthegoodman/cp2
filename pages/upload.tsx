
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { FormProvider, useForm } from "react-hook-form";
import useSWR, { SWRConfig } from "swr";
import Utilities from "@/lib";
import DesktopNavigation from "../components/layout/DesktopNavigation/DesktopNavigation";
import FormInput from "../components/fields/FormInput/FormInput";
import FormMessage from "../components/fields/FormMessage/FormMessage";
import FormTextarea from "../components/fields/FormTextarea/FormTextarea";
import FormUpload from "../components/fields/FormUpload/FormUpload";
import PrimaryHeader from "../components/layout/PrimaryHeader/PrimaryHeader";
import StepCounter from "../components/forms/StepCounter/StepCounter";
import { InterestsContent } from "./interests";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import nextI18NextConfig from "../next-i18next.config.js";
import { appWithTranslation, useTranslation } from "next-i18next/pages";
import apiClient from "../helpers/APIClient";
import MixpanelBrowser from "../helpers/MixpanelBrowser";
import { upload } from "@vercel/blob/client";
import InstallPWA from "@/components/growth/InstallPWA/InstallPWA";

const getUserData = async (token) => {
  apiClient.setupClient(token);
  const userData = await apiClient.get("/user");
  return { getUser: userData };
};

const UploadContent = () => {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(["coUserToken", "coPWA"]);
  const token = cookies.coUserToken;

  const mixpanel = new MixpanelBrowser();

  apiClient.setupClient(token);

  const { data } = useSWR("profileKey", () => getUserData(token));

  console.info("UploadContent", token, data);

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState("image");
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showInstallPWAModal, setShowInstallPWAModal] = useState(false);
  const [postRedirectPath, setPostRedirectPath] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [hasEnoughCredits, setHasEnoughCredits] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (formValues) => {
    console.log("onSubmit", formValues, contentType);

    setSubmitLoading(true);

    try {
      // Client-side upload to Vercel Blob
      let file1Url = "";
      if (formValues.file1 && formValues.file1.length > 0) {
        const file = formValues.file1[0];
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        file1Url = blob.url;
      }

      let file2Url = "";
      if (formValues.file2 && formValues.file2.length > 0) {
        const file = formValues.file2[0];
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        file2Url = blob.url;
      }

      // Remove large base64 data before sending to API
      const { file1Data, file2Data, ...cleanedFormValues } = formValues;

      const createdPost = await apiClient.post("/posts", {
        interestId: selectedInterest?.id,
        contentType,
        ...cleanedFormValues,
        file1Url,
        file2Url,
      });

      setSubmitLoading(false);

      console.info(
        "createdPost",
        createdPost,
        createdPost.generatedTitleSlug
      );

      mixpanel.track("Post Created", { createdPost });

      const redirectPath = `/post/${createdPost.interest?.generatedInterestSlug}/${createdPost.generatedTitleSlug}/?backPath=/profile/`;

      // Check if it's the first post and show PWA modal
      const isFirstPost = data?.getUser?.posts?.length === 0;
      if (isFirstPost && !cookies.coPWA) {
        setPostRedirectPath(redirectPath);
        setShowInstallPWAModal(true);
      } else {
        router.push(redirectPath);
      }
    } catch (error: any) {
      console.error("error", error);
      setSubmitLoading(false);
      const errorMessage = error.message;
      setFormErrorMessage(errorMessage);
      mixpanel.track("Post Creation Error", { errorMessage, error });
    }
  };

  const onError = (error) => console.error(error);

  const goBack = () => {
    if (step === 1) {
      // router.back();
      router.push("/queue");
    } else {
      setStep(step - 1);
    }
  };

  const goToNextStep = (nextStep) => {
    setStep(nextStep);
    setFormErrorMessage("");
  };

  const onNextClick = () => {
    const formValues = methods.getValues();
    const nextStep = step + 1;

    if (nextStep === 2) {
      if (contentType !== "" && selectedInterest !== null) {
        goToNextStep(nextStep);
      } else {
        setFormErrorMessage(t("upload:errors.interestRequired"));
      }
    } else if (nextStep === 3) {
      console.info("formValues", formValues);

      const tenMb = 10000000;
      if (formValues?.file1Size > tenMb || formValues?.file2Size > tenMb) {
        setFormErrorMessage(t("upload:errors.fileSize"));
        return;
      }

      if (contentType === "audio") {
        if (formValues?.file1?.length > 0 && formValues?.file2?.length > 0) {
          goToNextStep(nextStep);
        } else {
          setFormErrorMessage(t("upload:errors.bothFilesRequired"));
        }
      } else if (contentType === "image" || contentType === "video") {
        if (formValues?.file1?.length > 0) {
          goToNextStep(nextStep);
        } else {
          setFormErrorMessage(t("upload:errors.fileRequired"));
        }
      } else if (contentType === "text") {
        if (formValues?.text?.length > 0) {
          goToNextStep(nextStep);
        } else {
          setFormErrorMessage(t("upload:errors.textRequired"));
        }
      }
    }
  };

  const onPickInterest = () => {
    setStep(0);
    setShowInterestsModal(true);
  };

  const onCloseInterests = () => {
    setStep(1);
    setShowInterestsModal(false);
  };

  const onConfirmInterest = (category, interest) => {
    // console.info("onConfirmInterest", category, interest, data);
    setSelectedInterest(interest);
    setStep(1);
    setShowInterestsModal(false);

    // show credit warning if needed
    if (interest?.posts?.length > 5 && data?.getUser?.credit < 3) {
      setHasEnoughCredits(false);
    } else {
      setHasEnoughCredits(true);
    }
  };

  const onSelectType = (type) => {
    setContentType(type);
  };

  const contentTypes = ["image", "video", "audio", "text"];

  // console.info(
  //   "sel interest length",
  //   selectedInterest,
  //   selectedInterest?.posts?.length
  // );

  const submitButtonLabel =
    selectedInterest?.posts?.length > 5
      ? t("upload:submit.credits")
      : t("upload:submit.free");

  return (
    <>
      {showInstallPWAModal ? (
        <section
          className="fullModal"
          style={{
            zIndex: 110,
          }}
        >
          <InstallPWA
            onDone={() => {
              setCookie("coPWA", "true", { path: "/" });
              setShowInstallPWAModal(false);
              router.push(postRedirectPath);
            }}
          />
        </section>
      ) : (
        <></>
      )}
      {showInterestsModal ? (
        <InterestsContent
          onBack={onCloseInterests}
          onConfirm={onConfirmInterest}
        />
      ) : (
        <section className="upload">
          <div className="uploadInner">
            <PrimaryHeader
              inline={true}
              leftIcon={
                <>
                  <DesktopNavigation />
                  <a
                    // className="mobileOnly"
                    className={`backButton ${step === 1 ? "mobileOnly" : ""}`}
                    onClick={goBack}
                    href="#!"
                    aria-label="Go Back"
                  >
                    <i className="typcn typcn-arrow-left"></i>
                  </a>
                </>
              }
              title={t("upload:title")}
              rightIcon={<></>}
            />

            <main>
              <StepCounter step={step} creditCount={data?.getUser?.credit} />

              <FormProvider {...methods}>
                <form
                  className="form"
                  onSubmit={handleSubmit(onSubmit, onError)}
                >
                  <FormMessage type="error" message={formErrorMessage} />

                  {step === 1 ? (
                    <>
                      <div className="uploadSection">
                        <div className="uploadSectionInner">
                          <span>{t("upload:prompt.interest")}</span>
                          <button
                            className="button secondaryButton"
                            onClick={onPickInterest}
                            aria-label="Pick Interest"
                          >
                            {selectedInterest?.name ? (
                              <>{selectedInterest?.name}</>
                            ) : (
                              <>{t("common:pickInterest")}</>
                            )}
                          </button>
                        </div>
                      </div>

                      {hasEnoughCredits ? (
                        <>
                          <div className="uploadSection">
                            <div className="uploadSectionInner">
                              <span>{t("upload:prompt.kind")}</span>
                              <div className="contentTypePicker">
                                <div className="contentTypePickerInner">
                                  {contentTypes.map((type, i) => {
                                    return (
                                      <a
                                        className={`contentTypeOption ${
                                          contentType === type
                                            ? "selectedOption"
                                            : ""
                                        }`}
                                        href="#!"
                                        onClick={() => onSelectType(type)}
                                        aria-label={`Select ${type} Content Type`}
                                      >
                                        <div className="option">
                                          {contentType === type ? (
                                            <div className="mu mu-i-tick"></div>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                        <span>{t(`common:type.${type}`)}</span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/** TODO: step by step validation */}
                          <a
                            className="button"
                            onClick={onNextClick}
                            aria-label="Next"
                            href="#!"
                          >
                            {t("common:next")}
                          </a>
                        </>
                      ) : (
                        <FormMessage
                          type="error"
                          message={t("upload:errors.creditMinimum")}
                        />
                      )}
                    </>
                  ) : (
                    <></>
                  )}

                  {step === 2 ? (
                    <>
                      <div className="uploadSection">
                        <div className="uploadSectionInner">
                          {contentType === "text" ? (
                            <span>{t("upload:prompt.text")}</span>
                          ) : (
                            <span>{t("upload:prompt.upload")}</span>
                          )}
                          <div className="contentUpload">
                            <div className="contentUploadInner">
                              {contentType === "image" ? (
                                <FormUpload
                                  name="file1"
                                  placeholder={t("upload:placeholders.image")}
                                  accept="image/*"
                                  aria-label="Upload Image"
                                  register={register}
                                  errors={errors}
                                  validation={{
                                    required: contentType === "image",
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                              {contentType === "video" ? (
                                <FormUpload
                                  name="file1"
                                  placeholder={t("upload:placeholders.video")}
                                  accept="video/*"
                                  aria-label="Upload Video"
                                  register={register}
                                  errors={errors}
                                  validation={{
                                    required: contentType === "video",
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                              {contentType === "audio" ? (
                                <>
                                  <FormUpload
                                    name="file1"
                                    placeholder={t("upload:placeholders.audio")}
                                    accept="audio/*"
                                    aria-label="Upload Audio"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                      required: contentType === "audio",
                                    }}
                                  />
                                  <FormUpload
                                    name="file2"
                                    placeholder={t("upload:placeholders.art")}
                                    accept="image/*"
                                    aria-label="Upload Art"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                      required: contentType === "audio",
                                    }}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                              {contentType === "text" ? (
                                <>
                                  <FormTextarea
                                    name="text"
                                    rows={8}
                                    placeholder={t("upload:placeholders.text")}
                                    aria-label="Type Text Here"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                      required: contentType === "text",
                                    }}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <a
                        className="button"
                        onClick={onNextClick}
                        aria-label="Next"
                        href="#!"
                      >
                        {t("common:next")}
                      </a>
                    </>
                  ) : (
                    <></>
                  )}

                  {step === 3 ? (
                    <>
                      <div className="uploadSection">
                        <div className="uploadSectionInner">
                          <span>{t("upload:prompt.meta")}</span>
                          <FormInput
                            type="title"
                            name="title"
                            placeholder={t("upload:placeholders.title")}
                            register={register}
                            errors={errors}
                            validation={{
                              required: t("upload:errors.titleRequired"),
                            }}
                          />
                          <FormTextarea
                            name="description"
                            placeholder={t("upload:placeholders.description")}
                            register={register}
                            errors={errors}
                            validation={{ required: false }}
                          />
                        </div>
                      </div>

                      {/* <div className="uploadSection">
                      <div className="uploadSectionInner"></div>
                    </div> */}

                      <button
                        className="button"
                        type="submit"
                        aria-label={submitButtonLabel}
                        disabled={submitLoading}
                      >
                        {submitLoading
                          ? t("upload:submit.inProgress")
                          : submitButtonLabel}
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </form>
              </FormProvider>
            </main>
          </div>
        </section>
      )}
    </>
  );
};

const Upload: NextPage<{ fallback: any }> = ({ fallback }) => {
  return (
    <SWRConfig
      value={{ fallback, revalidateOnMount: true, refreshWhenHidden: true }}
    >
      <UploadContent />
    </SWRConfig>
  );
};

export async function getServerSideProps(context) {
  const utilities = new Utilities();
  const cookieData = utilities.helpers.parseCookie(context.req.headers.cookie);
  const token = cookieData.coUserToken;

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const userData = await getUserData(token);

  const locale =
    typeof cookieData.coUserLng !== "undefined"
      ? cookieData.coUserLng
      : context.locale;

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["interests", "impressions", "upload", "common"],
        nextI18NextConfig
      )),
      fallback: {
        profileKey: userData,
      },
    },
  };
}

export default Upload;
