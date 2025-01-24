'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '~/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/Form';
import { Input } from '~/components/ui/Input';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
import { Switch } from '~/components/ui/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/Table';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { RowData, VariableDefinition } from '~/types';
import { DEFAULT_ROWS, DEFAULT_VARIABLES } from '~/utils/constants';

const variableSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['boolean', 'number']),
  required: z.boolean(),
  weight: z.number().min(0),
});

const rowSchema = z.record(z.union([z.boolean(), z.number(), z.string()]));

export interface AppState {
  variables: VariableDefinition[];
  rows: RowData[];
}

export default function Home() {
  // Persist variables and rows in local storage
  const [variables, setVariables, mountedVariables] = useLocalStorage<
    VariableDefinition[]
  >('variables', DEFAULT_VARIABLES);
  const [rows, setRows, mountedRows] = useLocalStorage<RowData[]>(
    'rows',
    DEFAULT_ROWS,
  );

  // Dialog state
  const [openVariableDialog, setOpenVariableDialog] = useState(false);
  const [openRowDialog, setOpenRowDialog] = useState(false);
  const [editingVariable, setEditingVariable] =
    useState<VariableDefinition | null>(null);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);

  // Forms
  const variableForm = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: '',
      type: 'boolean',
      required: false,
      weight: 0,
    },
  });

  const rowForm = useForm<z.infer<typeof rowSchema>>({
    resolver: zodResolver(rowSchema),
    defaultValues: {},
  });

  function handleAddVariable(data: z.infer<typeof variableSchema>) {
    if (editingVariable) {
      // Update existing variable
      setVariables(
        variables.map((v) =>
          v.id === editingVariable.id ? { ...v, ...data } : v,
        ),
      );
      setEditingVariable(null);
    } else {
      // Add new variable
      const variable: VariableDefinition = {
        id: crypto.randomUUID(),
        ...data,
      };
      setVariables([...variables, variable]);
    }
    variableForm.reset();
    setOpenVariableDialog(false);
  }

  function handleAddRow(data: z.infer<typeof rowSchema>) {
    // Basic check: fill required variables
    for (const v of variables) {
      if (v.required && (data[v.name] === undefined || data[v.name] === '')) {
        return;
      }
    }

    if (editingRow) {
      // Update existing row
      setRows(
        rows.map((r) => (r.id === editingRow.id ? { ...r, values: data } : r)),
      );
      setEditingRow(null);
    } else {
      // Add new row
      const row: RowData = {
        id: crypto.randomUUID(),
        values: data,
      };
      setRows([...rows, row]);
    }
    rowForm.reset();
    setOpenRowDialog(false);
  }

  function startEditingVariable(variable: VariableDefinition) {
    setEditingVariable(variable);
    variableForm.reset({
      name: variable.name,
      type: variable.type,
      required: variable.required,
      weight: variable.weight,
    });
    setOpenVariableDialog(true);
  }

  function startEditingRow(row: RowData) {
    setEditingRow(row);
    rowForm.reset(row.values);
    setOpenRowDialog(true);
  }

  /**
   * Compute a simple "score" for each row based on variable types & weights.
   * - For boolean variables, treat `true` as 1 * weight, `false` as 0.
   * - For numeric variables, multiply value by weight.
   * (Adjust logic as needed for your real ranking algorithm.)
   */
  function computeRowScore(row: RowData) {
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

  // Sort rows by descending computed score (highest = best)
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => computeRowScore(b) - computeRowScore(a));
  }, [rows, variables]);

  if (!mountedVariables || !mountedRows) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Weighted Ranker</h1>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Variables</h2>
          <Dialog
            open={openVariableDialog}
            onOpenChange={setOpenVariableDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Add Variable</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingVariable ? 'Edit Variable' : 'New Variable'}
                </DialogTitle>
              </DialogHeader>
              <Form {...variableForm}>
                <form
                  onSubmit={variableForm.handleSubmit(handleAddVariable)}
                  className="space-y-4"
                >
                  <FormField
                    control={variableForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={variableForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={variableForm.control}
                    name="required"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel>Required?</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={variableForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpenVariableDialog(false);
                        setEditingVariable(null);
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {variables.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No variables defined yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variables.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => startEditingVariable(v)}
                >
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{v.weight}</TableCell>
                  <TableCell>{v.required ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ---------- Rows Section ---------- */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Rows</h2>
          <Dialog open={openRowDialog} onOpenChange={setOpenRowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Row</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRow ? 'Edit Row' : 'New Row'}</DialogTitle>
              </DialogHeader>
              <Form {...rowForm}>
                <form
                  onSubmit={rowForm.handleSubmit(handleAddRow)}
                  className="space-y-4"
                >
                  {variables.map((variable) => (
                    <FormField
                      key={variable.id}
                      control={rowForm.control}
                      name={variable.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{variable.name}</FormLabel>
                          <FormControl>
                            {variable.type === 'boolean' ? (
                              <Switch
                                checked={field.value === true}
                                onCheckedChange={field.onChange}
                              />
                            ) : (
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpenRowDialog(false);
                        setEditingRow(null);
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {sortedRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rows added yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {variables.map((variable) => (
                  <TableHead key={variable.id}>{variable.name}</TableHead>
                ))}
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row) => {
                const score = computeRowScore(row);
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => startEditingRow(row)}
                  >
                    {variables.map((v) => {
                      const val = row.values[v.name];
                      return (
                        <TableCell key={v.id}>
                          {v.type === 'boolean' ? String(val) : val}
                        </TableCell>
                      );
                    })}
                    <TableCell>{score.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
