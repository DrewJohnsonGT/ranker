export type VariableType = 'boolean' | 'number';

export interface VariableDefinition {
  id: string;
  name: string;
  type: VariableType;
  weight: number;
}

export interface RowData {
  id: string;
  name: string;
  values: Record<string, boolean | number | string>;
  rank?: number;
  score?: number;
}
