import { RowData, VariableDefinition } from '~/types';

export function computeRowScore(row: RowData, variables: VariableDefinition[]) {
  return variables.reduce((acc, v) => {
    const val = row.values[v.name];
    if (v.type === 'boolean') {
      return acc + (val === true ? v.weight : 0);
    } else if (v.type === 'number') {
      const numericVal =
        typeof val === 'number' ? val : parseFloat(val as string);
      return acc + numericVal * v.weight;
    }
    return acc;
  }, 0);
}
