export interface ProfilePostProps {
  ref?: React.Ref<any>;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  post: any;
  mutate: any;
  usersOwnProfile: boolean;
  creator: any;
}
