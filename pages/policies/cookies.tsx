import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";

const Cookies: NextPage = () => {
  return (
    <section className="settings">
      <div className="settingsInner">
        <NextSeo title={`Cookie Policy | Policies | CommonPlace`} />
        <PrimaryHeader
          className="centerHeader"
          inline={true}
          leftIcon={
            <Link href="/policies">
                <i className="typcn typcn-arrow-left"></i>
            </Link>
          }
          title="Cookie Policy"
          rightIcon={<></>}
        />
        <section className="policyContent">
          <div className="policyContentInner">
            <h3>Cookie Policy</h3>
            <p>Last Updated: May 11, 2026</p>

            <p>CommonPlace uses cookies to enhance your experience. This policy explains what cookies are and how we use them.</p>

            <h4>1. What are Cookies?</h4>
            <p>Cookies are small text files stored on your device by your web browser. They help websites remember your preferences and keep you logged in.</p>

            <h4>2. How We Use Cookies</h4>
            <ul>
              <li><strong>Essential Cookies:</strong> These are required for the platform to function, such as keeping you logged in.</li>
              <li><strong>Analytics Cookies:</strong> We use these to understand how users interact with the site, helping us improve the user experience.</li>
              <li><strong>Preference Cookies:</strong> These remember your settings, such as your language preference.</li>
            </ul>

            <h4>3. Third-Party Cookies</h4>
            <p>We may use third-party services like Google Analytics or Mixpanel that set their own cookies to provide us with anonymous usage data.</p>

            <h4>4. Managing Cookies</h4>
            <p>You can control or delete cookies through your browser settings. However, disabling essential cookies may prevent you from using certain parts of CommonPlace.</p>

            <p>If you have questions about our use of cookies, please contact us at alexthegoodman@gmail.com.</p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Cookies;
