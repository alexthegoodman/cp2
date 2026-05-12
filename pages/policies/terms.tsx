import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";

const Terms: NextPage = () => {
  return (
    <section className="settings">
      <div className="settingsInner">
        <NextSeo title={`Terms of Use | Policies | CommonPlace`} />
        <PrimaryHeader
          className="centerHeader"
          inline={true}
          leftIcon={
            <Link href="/policies">
                <i className="typcn typcn-arrow-left"></i>
            </Link>
          }
          title="Terms of Use"
          rightIcon={<></>}
        />
        <section className="policyContent">
          <div className="policyContentInner">
            <h3>Terms of Service</h3>
            <p>Last Updated: May 11, 2026</p>

            <p>By using CommonPlace, you agree to the following terms. Please read them carefully.</p>

            <h4>1. Eligibility</h4>
            <p>You must be at least 13 years old to use CommonPlace. By creating an account, you represent that you meet this requirement.</p>

            <h4>2. User Content & Feedback</h4>
            <p>You retain ownership of the content you upload to CommonPlace. However, by uploading content, you grant us a non-exclusive, royalty-free license to host, display, and distribute that content to other users for the purpose of the feedback-exchange service.</p>
            <p>Feedback provided by users is for informational purposes only. CommonPlace is not responsible for the accuracy or quality of user-provided feedback.</p>

            <h4>3. Community Guidelines</h4>
            <p>You agree not to upload content that is illegal, offensive, or violates the intellectual property rights of others. We reserve the right to remove content or suspend accounts that violate these guidelines.</p>

            <h4>4. The Credit System</h4>
            <p>CommonPlace uses a 'Review to Upload' model. Credits are earned by providing feedback and spent by uploading content. Credits have no monetary value and cannot be exchanged for cash.</p>

            <h4>5. Account Termination</h4>
            <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in behavior that harms the community.</p>

            <h4>6. Limitation of Liability</h4>
            <p>CommonPlace is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the platform.</p>

            <p>If you have questions about these terms, please contact us at alexthegoodman@gmail.com.</p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Terms;
