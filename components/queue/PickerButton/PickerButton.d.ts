import { SelectedFeed } from "./PickerButton";

export interface PickerButtonProps {
  ref?: React.Ref<any>;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  selectedFeed: SelectedFeed,
  onSelectInterestClick: (e: any) => void;
  onSelectFollowingFeedClick: (e: any) => void;
  selectedInterest: any;
}
