import * as React from "react";
import Link from "next/link";
import Strings from "../../../helpers/Strings";
import ContentViewer from "../../post/ContentViewer/ContentViewer";
import { LandingRecentPostsProps } from "./LandingRecentPosts";

const LandingRecentPosts: React.FC<LandingRecentPostsProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click"),
  headline = "Recent Posts",
  description = <p>See what others are sharing right now.</p>,
  posts = [],
}) => {
  const strings = new Strings();
  const clickHandler = (e) => onClick(e);

  return (
    <section className={`landingFeatures landingRecentPosts ${className}`}>
      <div className="contain">
        <div className="info">
          <h2>{headline}</h2>
          {description}
        </div>
        <div className="features">
          {posts.map((post, i) => {
            const postUrl = strings.getPostUrl(post);
            return (
              <div className="feature postPreview" key={i}>
                <Link href={postUrl}>
                  <div className="featureContain">
                    <div className="postVisual">
                      <ContentViewer
                        alt={post.title}
                        type={post.contentType}
                        preview={post.contentPreview}
                        content={post.content}
                        mini={true}
                      />
                    </div>
                    <span>{post.title}</span>
                    <p>By {post.creator?.chosenUsername || "Anonymous"}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingRecentPosts;
