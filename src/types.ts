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
  values: Partial<Record<string, boolean | number | string | null>>;
  rank?: number;
  score?: number;
  scorePercentage?: number;
  relativeScorePercentage?: number;
}

export interface AppState {
  variables: VariableDefinition[];
  rows: RowData[];
}
