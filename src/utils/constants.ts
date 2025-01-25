import { RowData, VariableDefinition } from '~/types';

export const NAME_OF_ROW = 'Site';

export const VARIABLES_LOCAL_STORAGE_KEY = 'variables';
export const ROWS_LOCAL_STORAGE_KEY = 'rows';
export const SAVED_STATES_LOCAL_STORAGE_KEY = 'savedStates';
export const LAST_LOADED_STATE_LOCAL_STORAGE_KEY = 'lastLoadedState';

export const MAX_VARIABLE_NUMERICAL_VALUE = 10;

export const DEFAULT_VARIABLES: VariableDefinition[] = [
  {
    id: crypto.randomUUID(),
    name: 'Has PCIT',
    type: 'boolean',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Quality of PCIT',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Has Autism Evals',
    type: 'boolean',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Quality of Autism Evals',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Has Research',
    type: 'boolean',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Quality of Research',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Location',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Culture',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Breadth',
    type: 'number',
    weight: 10,
  },
  {
    id: crypto.randomUUID(),
    name: 'Depth',
    type: 'number',
    weight: 10,
  },
];

export const DEFAULT_ROWS: RowData[] = [
  {
    id: crypto.randomUUID(),
    name: 'School A',
    values: {
      'Has PCIT': true,
      'Quality of PCIT': 4,
      'Has Autism Evals': true,
      'Quality of Autism Evals': 4,
      'Has Research': true,
      'Quality of Research': 4,
      Location: 4,
      Culture: 3,
      Breadth: 4,
      Depth: 4,
    },
  },
  {
    id: crypto.randomUUID(),
    name: 'School B',
    values: {
      'Has PCIT': false,
      'Quality of PCIT': 0,
      'Has Autism Evals': false,
      'Quality of Autism Evals': 0,
      'Has Research': true,
      'Quality of Research': 4,
      Location: 3,
      Culture: 4,
      Breadth: 3,
      Depth: 4,
    },
  },
  {
    id: crypto.randomUUID(),
    name: 'School C',
    values: {
      'Has PCIT': true,
      'Quality of PCIT': 3,
      'Has Autism Evals': true,
      'Quality of Autism Evals': 3,
      'Has Research': false,
      'Quality of Research': 0,
      Location: 5,
      Culture: 4,
      Breadth: 3,
      Depth: 3,
    },
  },
  {
    id: crypto.randomUUID(),
    name: 'School D',
    values: {
      'Has PCIT': true,
      'Quality of PCIT': 5,
      'Has Autism Evals': false,
      'Quality of Autism Evals': 0,
      'Has Research': true,
      'Quality of Research': 3,
      Location: 2,
      Culture: 5,
      Breadth: 4,
      Depth: 3,
    },
  },
  {
    id: crypto.randomUUID(),
    name: 'School E',
    values: {
      'Has PCIT': false,
      'Quality of PCIT': 0,
      'Has Autism Evals': true,
      'Quality of Autism Evals': 5,
      'Has Research': true,
      'Quality of Research': 5,
      Location: 3,
      Culture: 3,
      Breadth: 5,
      Depth: 5,
    },
  },
];
