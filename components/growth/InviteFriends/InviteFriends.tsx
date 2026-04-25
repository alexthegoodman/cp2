import Image from "next/image";
import * as React from "react";

import { InviteFriendsProps } from "./InviteFriends.d";
import { appWithTranslation, useTranslation } from "next-i18next/pages";
import MixpanelBrowser from "../../../helpers/MixpanelBrowser";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { cookieDomain, fullUrl, protocol } from "@/def/urls";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { ArrowCircleRightIcon } from "@phosphor-icons/react/dist/csr/ArrowCircleRight";

const InviteFriends: React.FC<InviteFriendsProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click InviteFriends"),
}) => {
  const { t } = useTranslation();
  const mixpanel = new MixpanelBrowser();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const shareToFacebook = () => {
    mixpanel.track("Invite via Facebook");

    // FB.ui(
    //   {
    //     method: "share",
    //     href: "https://commonplace.social/",
    //     hashtag: "CommonPlace",
    //     quote: "Get Feedback on CommonPlace!",
    //   },
    //   function (response) {}
    // );
  };

  const sendOnWhatsapp = () => {
    mixpanel.track("Invite via WhatsApp");

    const message = "Get Feedback on CommonPlace!";

    window.open("whatsapp://send?text=" + message, "_blank");
  };

  const sendViaEmail = () => {
    mixpanel.track("Invite via Email");

    const message = "Get Feedback on CommonPlace!";

    window.open("mailto:?body=" + encodeURIComponent(message), "_blank");
  };

  return (
    <div className="updateBanner">
      <section className="inviteFriends">
        <div className="inviteFriendsInner">
          <div className="inviteLabelWrapper">
            <span className="inviteLabel">{t("updates:inviteFriends")}</span>
            <span className="inviteLabel">Earn a free Boost</span>
          </div>
          <div className="inviteButtons">
            <div className="buttonList">
              <div className="listItem">
                <button
                  disabled={hasCopiedText}
                  onClick={() => copyToClipboard(fullUrl)}
                >
                  {hasCopiedText ? <><span>Copied!</span><CheckIcon size={20}/></> : <><span>Share</span><CopyIcon size={20} /></>}
                </button>
              </div>
            </div>
            
            {/* <ul className="buttonList">
              <li className="listItem">
                <a
                  href="#!"
                  onClick={shareToFacebook}
                  aria-label="Share via Facebook"
                >
                  <i className="typcn typcn-social-facebook"></i>
                </a>
              </li>
              <li className="listItem">
                <a
                  href="#!"
                  onClick={sendOnWhatsapp}
                  aria-label="Share via WhatsApp"
                >
                  <Image src="/whatsapp.svg" alt="Whatsapp" width="35" height="35" />
                </a>
              </li>
              <li className="listItem">
                <a href="#!" onClick={sendViaEmail} aria-label="Share via Email">
                  <i className="typcn typcn-mail"></i>
                </a>
              </li>
            </ul> */}
          </div>
        </div>
      </section>
      <section className="adCTA">
        <div className="adCTAInner">
          <span>Boost your posts with ads!</span>
        </div>
        <ArrowCircleRightIcon size={58} />
      </section>
    </div>
  );
};

export default InviteFriends;
