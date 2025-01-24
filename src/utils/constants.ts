import { RowData, VariableDefinition } from '~/types';

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
      'Quality of PCIT': 4.0,
      'Has Autism Evals': true,
      'Quality of Autism Evals': 4.5,
      'Has Research': true,
      'Quality of Research': 3.5,
      Location: 4.0,
      Culture: 3.0,
      Breadth: 4.0,
      Depth: 3.5,
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
      'Quality of Research': 4.5,
      Location: 3.0,
      Culture: 4.0,
      Breadth: 3.0,
      Depth: 4.5,
    },
  },
];
