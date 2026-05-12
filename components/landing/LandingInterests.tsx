import * as React from "react";
import Link from "next/link";

const LandingInterests: React.FC<{ categories: any[] }> = ({ categories = [] }) => {
  return (
    <section className="landingInterests">
      <div className="contain">
        <div className="info">
          <h2>Get feedback on anything</h2>
          <p>CommonPlace supports a wide variety of interests. Explore our most popular categories below:</p>
        </div>
        
        <div className="interestsGrid">
          {categories.map((category, i) => (
            <div key={i} className="categoryItem">
              <h4>{category.name}</h4>
              <ul>
                {category.interests?.map((interest, j) => (
                  <li key={j}>
                    {interest.name} Feedback
                  </li>
                ))}
                <li>
                    + more
                  </li>
              </ul>
            </div>
          ))}
        </div>
        
        <div className="ctaArea">
          <p>Don't see your interest? We're adding more every day.</p>
          <Link href="/sign-up" className="button">Join the community</Link>
        </div>
      </div>
    </section>
  );
};

export default LandingInterests;
