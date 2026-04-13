import { useRouter } from "next/router";
import * as React from "react";
import { useImageUrl } from "../../../hooks/useImageUrl";

// TODO: set ESLint ignore for `next build` type check
import { UpdateItemProps } from "./UpdateItem.d";

const UpdateItem: React.FC<UpdateItemProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click UpdateItem"),
  id = "",
  image = null,
  label = "",
  author = null,
  isRead = false,
  createdAt = "",
}) => {
  const router = useRouter();
  const goToThead = (e) => {
    onClick(e);

    router.push(`/updates/${id}`);
  };

  const { imageUrl: profileImageUrl } = useImageUrl(author?.profileImage, {
    fit: "cover",
    width: 100,
    height: 100,
  });

  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("default", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(createdAt))
    : "";

  return (
    <a
      href="#!"
      className="updateItem"
      onClick={goToThead}
      aria-label={`Message from ${author?.chosenUsername}`}
    >
      <div className="updateItemInner">
        <div className="itemImageWrapper">
          <img src={profileImageUrl} />
        </div>
        <div className="itemInformation">
          <div className="itemHeader">
            {author !== null ? (
              <span className="itemAttribution">{author?.chosenUsername}</span>
            ) : (
              <></>
            )}
            <span className="itemTimestamp">{formattedDate}</span>
          </div>
          <span className="itemLabel">{label}</span>
          {isRead ? (
            <div className="itemColor colorGrey"></div>
          ) : (
            <div className="itemColor colorRed"></div>
          )}
        </div>
      </div>
    </a>
  );
};

export default UpdateItem;
