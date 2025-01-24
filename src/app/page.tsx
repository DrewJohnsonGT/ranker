import { useLocalStorage } from '~/hooks/useLocalStorage';
import { DEFAULT_ROWS, DEFAULT_VARIABLES } from '~/utils/constants';
import { RowData, VariableDefinition } from '~/types';

export interface AppState {
  variables: VariableDefinition[];
  rows: RowData[];
}

export default function Home() {
  const [variables, setVariables] = useLocalStorage(
    'variables',
    DEFAULT_VARIABLES,
  );
  const [rows, setRows] = useLocalStorage('rows', DEFAULT_ROWS);

  return <div>Hello World</div>;
}
