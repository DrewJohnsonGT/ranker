'use client';

import { useMemo, useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Checkbox } from './ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/Form';
import { Input } from './ui/Input';
import { ScrollArea } from './ui/ScrollArea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/Table';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { FaMedal } from 'react-icons/fa';
import { LuArrowDownUp, LuPencil } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { RowData, VariableDefinition } from '~/types';
import { computeRowScore } from '~/utils/computeRowScore';
import {
  MAX_VARIABLE_NUMERICAL_VALUE,
  NAME_OF_ROW,
  OPEN_ROW_DIALOG_QUERY_KEY,
} from '~/utils/constants';
import { getValueColor } from '~/utils/getValueColor';
import { ICONS } from '~/utils/icons';

const rowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  values: z
    .record(z.union([z.boolean(), z.number(), z.string(), z.null()]).optional())
    .optional(),
});

export function DataCard({
  rows,
  setRows,
  variables,
}: {
  rows: RowData[];
  setRows: (rows: RowData[]) => void;
  variables: VariableDefinition[];
}) {
  const [openRowDialog, setOpenRowDialog] = useQueryState(
    OPEN_ROW_DIALOG_QUERY_KEY,
    parseAsBoolean.withDefault(false),
  );
  const [editingRow, setEditingRow] = useState<RowData | null>(null);
  const [isSorted, setIsSorted] = useState(false);

  const rowForm = useForm<z.infer<typeof rowSchema>>({
    resolver: zodResolver(rowSchema),
    defaultValues: {
      name: '',
      values: {},
    },
  });

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

  const handleDeleteRow = () => {
    if (editingRow) {
      setRows(rows.filter((r) => r.id !== editingRow.id));
      setEditingRow(null);
      setOpenRowDialog(false);
      toast.success(`${NAME_OF_ROW} deleted successfully`);
    }
  };

  const startEditingRow = (row: RowData) => {
    setEditingRow(row);
    rowForm.reset({
      name: row.name,
      values: row.values ?? {},
    });
    setOpenRowDialog(true);
  };

  const handleValueChange = (
    rowId: string,
    variableName: string,
    value: boolean | number,
  ) => {
    setRows(
      rows.map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            values: {
              ...r.values,
              [variableName]: value,
            },
          };
        }
        return r;
      }),
    );
  };

  const rowsWithScore = useMemo(() => {
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

    const withPercentages = rowsWithScores.map((row) => ({
      ...row,
      scorePercentage:
        totalPossibleScore > 0 ? (row.score / totalPossibleScore) * 100 : 0,
      relativeScorePercentage: rowsWithScores[0]?.score
        ? (row.score / rowsWithScores[0].score) * 100
        : 0,
    }));

    return withPercentages;
  }, [rows, variables]);

  const displayedRows = useMemo(() => {
    if (isSorted) {
      return [...rowsWithScore].sort((a, b) => b.score - a.score);
    }
    return rowsWithScore;
  }, [rowsWithScore, isSorted]);

  const getRankInfo = (row: (typeof rowsWithScore)[0]) => {
    const sortedScores = [...rowsWithScore].sort((a, b) => b.score - a.score);
    const rank = sortedScores.findIndex((r) => r.id === row.id) + 1;
    return { rank, medal: rank <= 3 };
  };

  return (
    <>
      <Dialog open={openRowDialog} onOpenChange={setOpenRowDialog}>
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
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={field.onChange}
                            />
                          ) : (
                            <Input
                              type="number"
                              min={0}
                              max={MAX_VARIABLE_NUMERICAL_VALUE}
                              className={`max-w-[100px] ${getValueColor(
                                Number(field.value),
                              )}`}
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
                    type="button"
                    color="destructive"
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ICONS.Rows className="size-6" />
              {NAME_OF_ROW}s
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSorted(!isSorted)}
              className="flex items-center gap-2"
            >
              <LuArrowDownUp className="size-4" />
              {isSorted ? 'Unsort' : 'Sort by Score'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4">
            {displayedRows.length === 0 ? (
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
                        <TableHead key={variable.id}>{variable.name}</TableHead>
                      ))}
                      <TableHead>Score</TableHead>
                      <TableHead>Score %</TableHead>
                      <TableHead>Relative Score %</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedRows.map((row) => {
                      const { rank, medal } = getRankInfo(row);
                      return (
                        <TableRow key={row.id} className="group hover:bg-muted">
                          <TableCell>
                            {medal && rank === 1 && (
                              <FaMedal className="text-yellow-500" />
                            )}
                            {medal && rank === 2 && (
                              <FaMedal className="text-gray-400" />
                            )}
                            {medal && rank === 3 && (
                              <FaMedal className="text-amber-600" />
                            )}
                            {(!medal || rank > 3) && rank}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          {variables.map((v) => {
                            const val = row.values[v.name];
                            return (
                              <TableCell key={v.id}>
                                {v.type === 'boolean' ? (
                                  <Checkbox
                                    checked={val === true}
                                    onCheckedChange={(checked) =>
                                      handleValueChange(
                                        row.id,
                                        v.name,
                                        checked ? true : false,
                                      )
                                    }
                                    className="data-[state=checked]:bg-rank-high data-[state=unchecked]:bg-rank-low"
                                  />
                                ) : (
                                  <Input
                                    type="number"
                                    min={0}
                                    max={MAX_VARIABLE_NUMERICAL_VALUE}
                                    value={val?.toString() ?? ''}
                                    onChange={(e) =>
                                      handleValueChange(
                                        row.id,
                                        v.name,
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className={`w-16 border-none bg-transparent p-0 focus:border-none focus:outline-none focus:ring-0 ${getValueColor(
                                      Number(val),
                                    )}`}
                                  />
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell>{row.score.toFixed(2)}</TableCell>
                          <TableCell>
                            {row.scorePercentage?.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            {row.relativeScorePercentage?.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="invisible group-hover:visible"
                              onClick={() => startEditingRow(row)}
                            >
                              <LuPencil className="size-4" />
                            </Button>
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
    </>
  );
}
