/**
 * The allowed data types for a Variable.
 * Example:
 * - "boolean" for true/false data
 * - "number" for numeric data
 */
export type VariableType = 'boolean' | 'number';

/**
 * Describes a single variable (criteria) that can be applied
 * to the rows of data.
 * - name: a human-readable identifier, e.g. "hasAutismEvals"
 * - type: either "boolean" or "number"
 * - required: whether this variable is mandatory for each row
 * - weight: how important this variable is in overall ranking (0–100, etc.)
 */
export interface VariableDefinition {
  id: string; // A unique ID (e.g., UUID or increment)
  name: string; // e.g. "hasAutismEvals"
  type: VariableType; // "boolean" or "number"
  required: boolean;
  weight: number; // e.g. 50
}

/**
 * Represents a single data row with values for all or some
 * of the defined variables.
 *
 * - Each key in "values" corresponds to the `VariableDefinition.name`.
 * - The value can be boolean or number (matching the variable type).
 */
export interface RowData {
  id: string;
  values: Record<string, boolean | number | string>;
  /**
   * If you want to store the row's computed score or rank directly,
   * you can include a field here (optional).
   */
  rank?: number;
}
