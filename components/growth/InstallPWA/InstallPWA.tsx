import * as React from "react";
import { useTranslation } from "next-i18next/pages";
import { usePWA } from "@/hooks/usePWA";

interface InstallPWAProps {
  onDone: () => void;
}

const InstallPWA: React.FC<InstallPWAProps> = ({ onDone }) => {
  const { t } = useTranslation();
  const { installPrompt, promptInstall, isStandalone } = usePWA();

  if (isStandalone) {
    onDone();
    return null;
  }

  const handleInstallClick = async () => {
    if (installPrompt) {
      await promptInstall();
      onDone();
    } else {
      // If no prompt is available (e.g., iOS or already installed)
      // We can show instructions or just skip
      onDone();
    }
  };

  return (
    <section className="installPwa">
      <div className="installPwaInner">
        <div className="installLabelWrapper">
          <span className="installLabel">{t("common:pwa.installTitle")}</span>
          <p className="installDescription">{t("common:pwa.installDescription")}</p>
        </div>
        <div className="installButtons">
          <button className="installButton primary" onClick={handleInstallClick}>
            {installPrompt ? t("common:pwa.installButton") : t("common:pwa.continueButton")}
          </button>
          <button className="installButton secondary" onClick={onDone}>
            {t("common:pwa.notNow")}
          </button>
        </div>
      </div>
      <style jsx>{`
        .installPwa {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          background: #fff;
          padding: 20px;
          text-align: center;
        }
        .installPwaInner {
          max-width: 400px;
        }
        .installLabel {
          display: block;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .installDescription {
          font-size: 16px;
          color: #666;
          margin-bottom: 30px;
        }
        .installButtons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .installButton {
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          border: none;
        }
        .installButton.primary {
          background: #000;
          color: #fff;
        }
        .installButton.secondary {
          background: transparent;
          color: #666;
        }
      `}</style>
    </section>
  );
};

export default InstallPWA;
