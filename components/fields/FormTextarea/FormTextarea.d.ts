export interface FormTextareaProps {
  name: string;
  rows?: number;
  placeholder?: string;
  errors?: FieldErrors;
  validation?: ValidationMap;
  register: UseFormRegister;
}
