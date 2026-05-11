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
  interestsByCategory = [],
  selectedInterest = null,
  selectedCategory = null,
  onSelectInterest = (cat, int) => console.info("Selected", cat, int)
}) => {
  const { t } = useTranslation();

  // console.info("interestsByCategory", interestsByCategory)

  return (
    <div className="sliderContainer">
      <div 
        className={`sliderItem ${!selectedInterest && !selectedCategory ? "selected" : ""}`}
        onClick={() => onSelectInterest(null, null)}
      >
        All
      </div>
      {interestsByCategory.map((cat) => {
        const isSelected = selectedCategory?.id === cat.id;
        return (
          <div 
            key={cat.id}
            className={`sliderItem ${isSelected ? "selected" : ""}`}
            onClick={() => onSelectInterest(cat, null)}
          >
            {cat.name}
          </div>
        )
      })}
    </div>
  );
};

export default InterestsSlider;
