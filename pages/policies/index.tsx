import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import PrimaryHeader from "../../components/layout/PrimaryHeader/PrimaryHeader";

const Policies: NextPage = () => {
  return (
    <section className="settings">
      <div className="settingsInner">
        <NextSeo title={`Policies | CommonPlace`} />
        <PrimaryHeader
          inline={true}
          leftIcon={
            <Link href="/settings">
                <i className="typcn typcn-arrow-left"></i>
            </Link>
          }
          title="Policies"
          rightIcon={<></>}
        />
        <section className="settingsList">
          <div className="settingsListInner">
            <Link href="/policies/terms/">
              Terms of Use
            </Link>
            <Link href="/policies/privacy/">
              Privacy Policy
            </Link>
            <Link href="/policies/cookies/">
              Cookie Policy
            </Link>
            <Link href="/policies/guidelines/">
              Community Guidelines
            </Link>
            <Link href="/policies/data-deletion/">
              Data Deletion Instructions
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Policies;
