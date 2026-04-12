export interface PopupModalProps {
  ref?: React.Ref<any>;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  description?: any;
  onCancel: any;
  controls: any;
}
