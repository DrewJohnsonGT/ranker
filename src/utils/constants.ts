import { RowData, VariableDefinition } from '~/types';

export const DEFAULT_VARIABLES: VariableDefinition[] = [
  {
    id: "var-1",
    name: "hasAutismEvals",
    type: "boolean", 
    required: true,
    weight: 50,
  },
  {
    id: "var-2", 
    name: "qualityOfAutismEvals",
    type: "number",
    required: false,
    weight: 50,
  }
];

export const DEFAULT_ROWS: RowData[] = [
  {
    id: "row-a",
    values: {
      hasAutismEvals: true,
      qualityOfAutismEvals: 4.5,
    },
  },
  {
    id: "row-b", 
    values: {
      hasAutismEvals: false,
      qualityOfAutismEvals: 5,
    },
  }
];
