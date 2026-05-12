import * as React from "react";

const LandingSocialProof: React.FC<{ headline?: string; subheadline?: string }> = ({
  headline = "Trusted by over 500 creators",
  subheadline = "Join a growing community of hobbyists sharing honest feedback.",
}) => {
  return (
    <section className="landingSocialProof">
      <div className="landingSocialProofInner">
        <div className="proofInner">
          <i className="typcn typcn-group"></i>
          <div className="text">
            <h4>{headline}</h4>
            <p>{subheadline}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSocialProof;
