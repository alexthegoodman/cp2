import * as React from "react";
import { useCookies } from "react-cookie";
import apiClient from "../../../helpers/APIClient";
import PopupModal from "../../utility/PopupModal/PopupModal";

import { PostInteractionProps } from "./PostInteraction.d";
import Strings from "../../../helpers/Strings";
import MixpanelBrowser from "../../../helpers/MixpanelBrowser";

const PostInteraction: React.FC<PostInteractionProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click PostInteraction"),
  post = null,
}) => {
  const mixpanel = new MixpanelBrowser();
  const strings = new Strings();
  const [cookies] = useCookies(["coUserToken"]);
  const token = cookies.coUserToken;
  apiClient.setupClient(token);

  const [favorited, setFavorited] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  console.info("PostInteraction", post?.favoritedByCurrentUser);

  React.useEffect(() => {
    setFavorited(post?.favoritedByCurrentUser);
  }, [post?.favoritedByCurrentUser]);

  const toggleFavorite = async () => {
    console.info("toggleFavorite", post.id);

    await apiClient.post("/posts/favorite", {
      postId: post.id,
    });

    if (favorited) {
      setFavorited(false);
    } else {
      setFavorited(true);
    }
  };

  const postUrl = strings.getPostUrl(post);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="postInteraction">
      <div className="postInteractionInner">
        <a
          href="#!"
          className={`interaction ${favorited ? "favorited" : ""}`}
          onClick={toggleFavorite}
        >
          <i className="typcn typcn-heart-outline"></i>
        </a>
        <a
          href="#!"
          className="interaction"
          onClick={(e) => {
            e.preventDefault();
            setShowShareModal(true);
          }}
        >
          <i className="typcn typcn-export-outline"></i>
        </a>
      </div>

      {showShareModal && (
        <div className="shareModalOverlay" onClick={() => setShowShareModal(false)}>
          <div className="shareModalWrapper" onClick={(e) => e.stopPropagation()}>
            <PopupModal
              onCancel={() => setShowShareModal(false)}
              title="Share Creation"
              description={
                <div className="shareModalBody">
                  <p className="shareInstruction">Copy the link below to share this post:</p>
                  <div className="shareLinkContainer">
                    <input
                      type="text"
                      readOnly
                      value={postUrl}
                      className="shareLinkInput"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      className={`shareCopyButton ${copied ? "copied" : ""}`}
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <i className="typcn typcn-tick"></i>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <i className="typcn typcn-clipboard"></i>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="socialShareGrid">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out "${post?.title}" on CommonPlace! ${postUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="socialShareBtn twitter"
                      onClick={() => mixpanel.track("Post Shared", { post, platform: "Twitter" })}
                    >
                      <i className="typcn typcn-social-twitter"></i>
                      <span>Twitter</span>
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="socialShareBtn facebook"
                      onClick={() => mixpanel.track("Post Shared", { post, platform: "Facebook" })}
                    >
                      <i className="typcn typcn-social-facebook"></i>
                      <span>Facebook</span>
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Check out "${post?.title}" on CommonPlace! ${postUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="socialShareBtn whatsapp"
                      onClick={() => mixpanel.track("Post Shared", { post, platform: "WhatsApp" })}
                    >
                      <i className="typcn typcn-social-whatsapp"></i>
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        `Check out this post on CommonPlace`
                      )}&body=${encodeURIComponent(`Here is the link: ${postUrl}`)}`}
                      className="socialShareBtn email"
                      onClick={() => mixpanel.track("Post Shared", { post, platform: "Email" })}
                    >
                      <i className="typcn typcn-mail"></i>
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              }
              controls={
                <button
                  className="button secondaryButton"
                  onClick={() => setShowShareModal(false)}
                  style={{ width: "100%", margin: 0 }}
                >
                  Close
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteraction;
