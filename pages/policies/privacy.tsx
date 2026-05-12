import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Script from "next/script";
import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";

const Privacy: NextPage = () => {
  return (
    <section className="settings">
      <div className="settingsInner">
        <NextSeo title={`Privacy Policy | Policies | CommonPlace`} />
        <PrimaryHeader
          className="centerHeader"
          inline={true}
          leftIcon={
            <Link href="/policies">
                <i className="typcn typcn-arrow-left"></i>
            </Link>
          }
          title="Privacy Policy"
          rightIcon={<></>}
        />
        <section className="policyContent">
          <div className="policyContentInner">
            <h3>Privacy Policy</h3>
            <p>Last Updated: May 11, 2026</p>
            
            <p>At CommonPlace, we take your privacy seriously. This policy explains what information we collect, how we use it, and your rights regarding your data.</p>
            
            <h4>1. Information We Collect</h4>
            <p><strong>Account Information:</strong> When you sign up, we collect your email address, name, and chosen username.</p>
            <p><strong>Content:</strong> We store the posts (images, text, audio, video) you upload and the feedback (impressions/messages) you provide to others.</p>
            <p><strong>Usage Data:</strong> We collect technical information such as your IP address, browser type, and interactions with the platform to improve our service.</p>
            
            <h4>2. How We Use Your Information</h4>
            <ul>
              <li>To provide the core feedback-exchange service.</li>
              <li>To manage your credit system and account permissions.</li>
              <li>To improve our platform and develop new features.</li>
              <li>To communicate with you regarding your account or updates.</li>
            </ul>
            
            <h4>3. Data Sharing</h4>
            <p>We do not sell your personal data. We only share information with third-party services (like database providers or image hosting) necessary to run the platform, or if required by law.</p>
            
            <h4>4. Your Rights</h4>
            <p>You have the right to access, update, or delete your personal information at any time via your settings page. For a full data deletion request, please visit our <Link href="/policies/data-deletion">Data Deletion page</Link>.</p>
            
            <h4>5. Cookies</h4>
            <p>We use cookies to keep you logged in and to analyze site traffic. For more details, see our <Link href="/policies/cookies">Cookie Policy</Link>.</p>
            
            <p>If you have any questions about this policy, please contact us at alexthegoodman@gmail.com.</p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Privacy;
