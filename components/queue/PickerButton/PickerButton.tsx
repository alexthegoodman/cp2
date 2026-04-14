import { appWithTranslation, useTranslation } from "next-i18next/pages";
import * as React from "react";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import { AtomIcon } from "@phosphor-icons/react/dist/csr/Atom";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";

import { PickerButtonProps } from "./PickerButton.d";

export enum SelectedFeed {
  Following,
  Interests
}

const PickerButton: React.FC<PickerButtonProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click PickerButton"),
  selectedFeed = SelectedFeed,
  onSelectInterestClick = (e) => console.info("onSelectInterestClick"),
  onSelectFollowingFeedClick = (e) => console.info("onSelectFollowingFeedClick"),
  selectedInterest = null,
}) => {
  const { t } = useTranslation();

  return (
    <div className="pickerContainer">
      <a
        className={`pickerButton ${selectedFeed === SelectedFeed.Following ? "selected" : ""}`}
        href="#!"
        onClick={onSelectFollowingFeedClick}
        aria-label="Select Interest"
      >
        <UsersIcon weight="bold" />
        Following
      </a>
      <a
        className={`pickerButton ${selectedFeed === SelectedFeed.Interests ? "selected" : ""}`}
        href="#!"
        onClick={onSelectInterestClick}
        aria-label="Select Interest"
      >
        <LightningIcon weight="bold" />
        {selectedInterest === null
          ? t("interests:ui.allInterests")
          : selectedInterest?.name}
      </a>
    </div>
    
  );
};

export default PickerButton;
