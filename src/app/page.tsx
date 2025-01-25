'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FaMedal } from 'react-icons/fa';
import { LuCheck, LuOctagonAlert, LuX } from 'react-icons/lu';
import { toast } from 'sonner';
import z from 'zod';
import { AppStateDialog } from '~/components/AppStateDialog';
import { RankedBars } from '~/components/RankedBars';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import { Button } from '~/components/ui/Button';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
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
import { ScrollArea } from '~/components/ui/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
import { Separator } from '~/components/ui/Separator';
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
  MAX_VARIABLE_NUMERICAL_VALUE,
  NAME_OF_ROW,
  ROWS_LOCAL_STORAGE_KEY,
  VARIABLES_LOCAL_STORAGE_KEY,
} from '~/utils/constants';
import { getValueColor } from '~/utils/getValueColor';
import { ICONS } from '~/utils/icons';

const variableSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['boolean', 'number']),
  weight: z.number().min(0),
});

const rowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  values: z
    .record(z.union([z.boolean(), z.number(), z.string(), z.null()]).optional())
    .optional(),
});

export default function Home() {
  const {
    value: variables,
    setValue: setVariables,
    mounted: mountedVariables,
  } = useLocalStorage<VariableDefinition[]>(
    VARIABLES_LOCAL_STORAGE_KEY,
    DEFAULT_VARIABLES,
  );

  const {
    value: rows,
    setValue: setRows,
    mounted: mountedRows,
  } = useLocalStorage<RowData[]>(ROWS_LOCAL_STORAGE_KEY, DEFAULT_ROWS);

  const [openVariableDialog, setOpenVariableDialog] = useState(false);
  const [openRowDialog, setOpenRowDialog] = useState(false);
  const [editingVariable, setEditingVariable] =
    useState<VariableDefinition | null>(null);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);

  const variableForm = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: '',
      type: 'number',
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

  const handleAddVariable = (data: z.infer<typeof variableSchema>) => {
    if (editingVariable) {
      setVariables(
        variables.map((v) =>
          v.id === editingVariable.id ? { ...v, ...data } : v,
        ),
      );
      setEditingVariable(null);
      toast.success('Variable updated successfully');
    } else {
      const variable: VariableDefinition = {
        id: crypto.randomUUID(),
        ...data,
      };
      setVariables([...variables, variable]);
      toast.success('Variable added successfully');
    }
    variableForm.reset();
    setOpenVariableDialog(false);
  };

  const handleAddRow = (data: z.infer<typeof rowSchema>) => {
    if (editingRow) {
      // Update existing row
      setRows(
        rows.map((r) =>
          r.id === editingRow.id
            ? { ...r, values: data.values ?? {}, name: data.name }
            : r,
        ),
      );
      setEditingRow(null);
      toast.success(`${NAME_OF_ROW} updated successfully`);
    } else {
      // Add new row
      const row: RowData = {
        id: crypto.randomUUID(),
        name: data.name,
        values: data.values ?? {},
      };
      setRows([...rows, row]);
      toast.success(`${NAME_OF_ROW} added successfully`);
    }
    rowForm.reset();
    setOpenRowDialog(false);
  };

  const handleDeleteVariable = () => {
    if (editingVariable) {
      setVariables(variables.filter((v) => v.id !== editingVariable.id));
      setEditingVariable(null);
      setOpenVariableDialog(false);
      toast.success('Variable deleted successfully');
    }
  };

  const handleDeleteRow = () => {
    if (editingRow) {
      setRows(rows.filter((r) => r.id !== editingRow.id));
      setEditingRow(null);
      setOpenRowDialog(false);
      toast.success(`${NAME_OF_ROW} deleted successfully`);
    }
  };

  const startEditingVariable = (variable: VariableDefinition) => {
    setEditingVariable(variable);
    variableForm.reset({
      name: variable.name,
      type: variable.type,
      weight: variable.weight,
    });
    setOpenVariableDialog(true);
  };

  const startEditingRow = (row: RowData) => {
    setEditingRow(row);
    rowForm.reset({
      name: row.name,
      values: row.values ?? {},
    });
    setOpenRowDialog(true);
  };

  const handleVariableDialogOpenChange = (open: boolean) => {
    setOpenVariableDialog(open);
    if (!open) {
      setEditingVariable(null);
    }
  };

  const sortedVariables = useMemo(() => {
    return [...variables].sort((a, b) => b.weight - a.weight);
  }, [variables]);

  const maxScore = useMemo(() => {
    return rows.reduce((acc, row) => {
      const score = computeRowScore(row, variables);
      return Math.max(acc, score);
    }, 0);
  }, [rows, variables]);

  const sortedRowsWithScore = useMemo(() => {
    const rowsWithScores = [...rows].map((row) => ({
      ...row,
      score: computeRowScore(row, variables),
    }));

    const totalPossibleScore = variables.reduce((acc, v) => {
      if (v.type === 'boolean') {
        return acc + v.weight;
      } else if (v.type === 'number') {
        return (
          acc +
          (MAX_VARIABLE_NUMERICAL_VALUE / MAX_VARIABLE_NUMERICAL_VALUE) *
            v.weight
        );
      }
      return acc;
    }, 0);

    return rowsWithScores
      .map((row) => ({
        ...row,
        scorePercentage:
          totalPossibleScore > 0 ? (row.score / totalPossibleScore) * 100 : 0,
        relativeScorePercentage: rowsWithScores[0]?.score
          ? (row.score / rowsWithScores[0].score) * 100
          : 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [rows, variables]);

  const totalWeight = useMemo(() => {
    return variables.reduce((acc, v) => acc + v.weight, 0);
  }, [variables]);

  if (!mountedVariables || !mountedRows) {
    return <LoadingSpinner />;
  }

  return (
    <div className="">
      <div className="flex items-center gap-2 px-2">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="mr-auto text-3xl font-bold">Rankings</h1>
        <AppStateDialog />
        <Dialog
          open={openVariableDialog}
          onOpenChange={handleVariableDialogOpenChange}
        >
          <Button onClick={() => setOpenVariableDialog(true)}>
            Add Variable
          </Button>
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
                          <SelectItem value="boolean">True/False</SelectItem>
                          <SelectItem value="number">
                            Number (0-{MAX_VARIABLE_NUMERICAL_VALUE})
                          </SelectItem>
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
                <DialogFooter className="flex">
                  {editingVariable && (
                    <Button
                      variant="outline"
                      type="button"
                      color="destructive"
                      className="mr-auto"
                      onClick={handleDeleteVariable}
                    >
                      Delete
                    </Button>
                  )}
                  <div className="flex gap-2">
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
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={openRowDialog} onOpenChange={setOpenRowDialog}>
          <DialogTrigger asChild>
            <Button>Add {NAME_OF_ROW}</Button>
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
                                max={MAX_VARIABLE_NUMERICAL_VALUE}
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
                <DialogFooter className="flex">
                  {editingRow && (
                    <Button
                      variant="outline"
                      color="destructive"
                      type="button"
                      className="mr-auto"
                      onClick={handleDeleteRow}
                    >
                      Delete
                    </Button>
                  )}
                  <div className="flex gap-2">
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
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="w-full flex-1" />
      <ScrollArea className="flex-1">
        <div className="flex flex-wrap gap-2 p-2">
          <Accordion type="single" className="min-w-96 flex-1" collapsible>
            <AccordionItem value="variables">
              <Card className="max-w-xl">
                <CardHeader>
                  <AccordionTrigger className="flex w-full items-center justify-between py-0">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <ICONS.Variables className="size-6" />
                      Variables ({variables.length})
                      {totalWeight !== 100 && (
                        <span className="flex items-center gap-1 text-base text-destructive">
                          <LuOctagonAlert className="size-4" />
                          Weights do not add up to 100 ({totalWeight})
                        </span>
                      )}
                    </h2>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-4">
                      {sortedVariables.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No variables defined yet.
                        </p>
                      ) : (
                        <ScrollArea className="min-h-0 rounded-b-md border-b bg-background">
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
                                  className="cursor-pointer hover:bg-muted hover:text-primary"
                                  onClick={() => startEditingVariable(v)}
                                >
                                  <TableCell>{v.name}</TableCell>
                                  <TableCell>
                                    {v.type === 'boolean'
                                      ? 'True/False'
                                      : 'Number'}
                                  </TableCell>
                                  <TableCell>{v.weight}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ICONS.Rows className="size-6" />
                {NAME_OF_ROW}s
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col gap-4">
                {sortedRowsWithScore.length === 0 ? (
                  <p className="m-auto p-4 text-sm text-muted-foreground">
                    No {NAME_OF_ROW}s added yet.
                  </p>
                ) : (
                  <ScrollArea className="min-h-0 rounded-b-md border-b bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Name</TableHead>
                          {variables.map((variable) => (
                            <TableHead key={variable.id}>
                              {variable.name}
                            </TableHead>
                          ))}
                          <TableHead>Score</TableHead>
                          <TableHead>Score %</TableHead>
                          <TableHead>Relative Score %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRowsWithScore.map((row, index) => {
                          const score = row.score;
                          return (
                            <TableRow
                              key={row.id}
                              className="cursor-pointer hover:bg-muted hover:text-primary"
                              onClick={() => startEditingRow(row)}
                            >
                              <TableCell>
                                {index === 0 && (
                                  <FaMedal className="text-yellow-500" />
                                )}
                                {index === 1 && (
                                  <FaMedal className="text-gray-400" />
                                )}
                                {index === 2 && (
                                  <FaMedal className="text-amber-600" />
                                )}
                                {index > 2 && index + 1}
                              </TableCell>
                              <TableCell>{row.name}</TableCell>
                              {variables.map((v) => {
                                const val = row.values[v.name];
                                return (
                                  <TableCell key={v.id}>
                                    {v.type === 'boolean' ? (
                                      <span
                                        className={
                                          val
                                            ? 'text-rank-high'
                                            : 'text-rank-low'
                                        }
                                      >
                                        {val ? <LuCheck /> : <LuX />}
                                      </span>
                                    ) : (
                                      <span
                                        className={getValueColor(Number(val))}
                                      >
                                        {val}
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              })}
                              <TableCell>{score.toFixed(2)}</TableCell>
                              <TableCell>
                                {row.scorePercentage?.toFixed(1)}%
                              </TableCell>
                              <TableCell>
                                {row.relativeScorePercentage?.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
          {sortedRowsWithScore.length > 0 && (
            <RankedBars rows={sortedRowsWithScore} maxScore={maxScore} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
