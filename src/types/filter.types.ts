export type FilterFieldType = 'text' | 'select';

export interface FilterOption<T = string | number | boolean> {
  label: string;
  value: T;
}

export interface FilterField<T = string | number | boolean> {
  name: string;
  label: string;
  type: FilterFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FilterOption<T>[];
  colClass?: string;
}

export type FilterValues = Record<string, string | number | boolean>;
