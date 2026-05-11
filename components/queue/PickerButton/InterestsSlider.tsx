import { appWithTranslation, useTranslation } from "next-i18next/pages";
import * as React from "react";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import { AtomIcon } from "@phosphor-icons/react/dist/csr/Atom";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";

import { PickerButtonProps } from "./PickerButton.d";

const InterestsSlider: React.FC<any> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click PickerButton"),
  interestsByCategory = null
}) => {
  const { t } = useTranslation();

  console.info("interestsByCategory", interestsByCategory)

  return (
    <div className="sliderContainer">
      <div className="sliderItem">
        All
      </div>
      {interestsByCategory.map((cat) => {
        return (
          <div className="sliderItem">
            {cat.name}
          </div>
        )
      })}
    </div>
  );
};

export default InterestsSlider;
