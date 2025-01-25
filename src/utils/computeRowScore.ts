import { MAX_VARIABLE_NUMERICAL_VALUE } from './constants';
import { RowData, VariableDefinition } from '~/types';

export function computeRowScore(row: RowData, variables: VariableDefinition[]) {
  return variables.reduce((acc, v) => {
    const val = row.values[v.name];
    if (v.type === 'boolean') {
      return acc + (val === true ? v.weight : 0);
    } else if (v.type === 'number') {
      const numericVal =
        typeof val === 'number' ? val : parseFloat(val as string) || 0;
      return acc + (numericVal / MAX_VARIABLE_NUMERICAL_VALUE) * v.weight;
    }
    return acc;
  }, 0);
}
