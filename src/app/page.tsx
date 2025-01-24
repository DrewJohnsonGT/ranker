'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuOctagonAlert } from 'react-icons/lu';
import z from 'zod';
import { RankedBars } from '~/components/RankedBars';
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
import { computeRowScore } from '~/utils/computeRowScore';
import {
  DEFAULT_ROWS,
  DEFAULT_VARIABLES,
  NAME_OF_ROW,
} from '~/utils/constants';
import { getValueColor } from '~/utils/getValueColor';

const variableSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['boolean', 'number']),
  weight: z.number().min(0),
});

const rowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  values: z.record(z.union([z.boolean(), z.number(), z.string()])),
});

export interface AppState {
  variables: VariableDefinition[];
  rows: RowData[];
}

export default function Home() {
  const [variables, setVariables, mountedVariables] = useLocalStorage<
    VariableDefinition[]
  >('variables', DEFAULT_VARIABLES);
  const [rows, setRows, mountedRows] = useLocalStorage<RowData[]>(
    'rows',
    DEFAULT_ROWS,
  );

  const [openVariableDialog, setOpenVariableDialog] = useState(false);
  const [openRowDialog, setOpenRowDialog] = useState(false);
  const [editingVariable, setEditingVariable] =
    useState<VariableDefinition | null>(null);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);

  const variableForm = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: '',
      type: 'boolean',
      weight: 0,
    },
  });

  const rowForm = useForm<z.infer<typeof rowSchema>>({
    resolver: zodResolver(rowSchema),
    defaultValues: {
      name: '',
      values: {},
    },
  });

  function handleAddVariable(data: z.infer<typeof variableSchema>) {
    if (editingVariable) {
      setVariables(
        variables.map((v) =>
          v.id === editingVariable.id ? { ...v, ...data } : v,
        ),
      );
      setEditingVariable(null);
    } else {
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
    if (editingRow) {
      // Update existing row
      setRows(
        rows.map((r) =>
          r.id === editingRow.id ? { ...r, values: data.values } : r,
        ),
      );
      setEditingRow(null);
    } else {
      // Add new row
      const row: RowData = {
        id: crypto.randomUUID(),
        name: data.name,
        values: data.values,
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
      weight: variable.weight,
    });
    setOpenVariableDialog(true);
  }

  function startEditingRow(row: RowData) {
    setEditingRow(row);
    rowForm.reset({
      name: row.name,
      values: row.values,
    });
    setOpenRowDialog(true);
  }

  const sortedVariables = useMemo(() => {
    return [...variables].sort((a, b) => a.weight - b.weight);
  }, [variables]);

  const sortedRowsWithScore = useMemo(() => {
    return [...rows]
      .map((row) => ({
        ...row,
        score: computeRowScore(row, variables),
      }))
      .sort((a, b) => b.score - a.score);
  }, [rows, variables]);

  const totalWeight = useMemo(() => {
    return variables.reduce((acc, v) => acc + v.weight, 0);
  }, [variables]);

  const maxScore = useMemo(() => {
    if (!sortedRowsWithScore[0]) return 0;
    return sortedRowsWithScore[0].score;
  }, [sortedRowsWithScore]);

  if (!mountedVariables || !mountedRows) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Ranker</h1>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Variables
            {totalWeight !== 100 && (
              <span className="flex items-center gap-1 text-base text-destructive">
                <LuOctagonAlert className="size-4" />
                Weights do not add up to 100 ({totalWeight})
              </span>
            )}
          </h2>
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

        {sortedVariables.length === 0 ? (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVariables.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => startEditingVariable(v)}
                >
                  <TableCell>{v.name}</TableCell>
                  <TableCell>
                    {v.type === 'boolean' ? 'True/False' : 'Number'}
                  </TableCell>
                  <TableCell>{v.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{NAME_OF_ROW}s</h2>
          <Dialog open={openRowDialog} onOpenChange={setOpenRowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Add {NAME_OF_ROW}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRow ? `Edit ${NAME_OF_ROW}` : `New ${NAME_OF_ROW}`}
                </DialogTitle>
              </DialogHeader>
              <Form {...rowForm}>
                <form
                  onSubmit={rowForm.handleSubmit(handleAddRow)}
                  className="space-y-4"
                >
                  <FormField
                    control={rowForm.control}
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
                  <div className="grid grid-cols-2 gap-2">
                    {variables.map((variable) => (
                      <FormField
                        key={variable.id}
                        control={rowForm.control}
                        name={`values.${variable.name}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
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
                                  min={0}
                                  max={10}
                                  className={`max-w-[100px] ${getValueColor(Number(field.value))}`}
                                  {...field}
                                  value={field.value?.toString() ?? ''}
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
                  </div>
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

        {sortedRowsWithScore.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No {NAME_OF_ROW}s added yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {variables.map((variable) => (
                  <TableHead key={variable.id}>{variable.name}</TableHead>
                ))}
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRowsWithScore.map((row) => {
                const score = row.score;
                const percentage =
                  maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : '0.0';
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => startEditingRow(row)}
                  >
                    <TableCell>{row.name}</TableCell>
                    {variables.map((v) => {
                      const val = row.values[v.name];
                      return (
                        <TableCell key={v.id}>
                          {v.type === 'boolean' ? (
                            <span
                              className={
                                val ? 'text-rank-high' : 'text-rank-low'
                              }
                            >
                              {String(val)}
                            </span>
                          ) : (
                            <span className={getValueColor(Number(val))}>
                              {val}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {score.toFixed(2)} ({percentage}%)
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <RankedBars rows={sortedRowsWithScore} maxScore={maxScore} />
    </div>
  );
}
