import Link from "next/link";
import * as React from "react";
import ProfileAvatar from "../../profile/ProfileAvatar/ProfileAvatar";

import { ProfileLinkProps } from "./ProfileLink.d";

const ProfileLink: React.FC<ProfileLinkProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click ProfileLink"),
  post = null,
  profileSEOStatement = "",
}) => {
  const clickHandler = (e: MouseEvent) => onClick(e);

  console.info("post", post)

  return (
    <>
      {post?.creator !== null ? (
        <>
          <div className="contentAuthor">
            <div className="contentAuthorInner">
              <div className="authorProfileImage">
                <ProfileAvatar
                  alt={profileSEOStatement}
                  title={profileSEOStatement}
                  src={post?.creator?.profileImage}
                  urlOptions={{
                    fit: "cover",
                    width: 100,
                    height: 100,
                  }}
                />
              </div>
              <div className="authorInformationWrapper">
                <div className="authorInformation">
                  <span className="authorAttribution">
                    {post?.creator?.chosenUsername}
                  </span>
                  <Link className="profileLink" href={`/co/${post?.creator?.chosenUsername}`}>Visit Profile</Link>
                  <a className="followLink" href="#">Follow</a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfileLink;
