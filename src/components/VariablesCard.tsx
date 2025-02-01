'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { LuOctagonAlert, LuPencil } from 'react-icons/lu';
import { toast } from 'sonner';
import z from 'zod';
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
import { ScrollArea } from '~/components/ui/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/Table';
import { useLocalStorageState } from '~/hooks/useLocalStorageState';
import { RowData, VariableDefinition } from '~/types';
import {
  MAX_VARIABLE_NUMERICAL_VALUE,
  OPEN_VARIABLE_DIALOG_QUERY_KEY,
  ROWS_LOCAL_STORAGE_KEY,
} from '~/utils/constants';
import { ICONS } from '~/utils/icons';

const variableSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['boolean', 'number']),
  weight: z.number().min(0),
});

export function VariablesCard({
  variables,
  setVariables,
}: {
  variables: VariableDefinition[];
  setVariables: (variables: VariableDefinition[]) => void;
}) {
  const [openVariableDialog, setOpenVariableDialog] = useQueryState(
    OPEN_VARIABLE_DIALOG_QUERY_KEY,
    parseAsBoolean.withDefault(false),
  );
  const [editingVariable, setEditingVariable] =
    useState<VariableDefinition | null>(null);
  const [rows, setRows] = useLocalStorageState<RowData[]>(
    ROWS_LOCAL_STORAGE_KEY,
    [],
  );

  const variableForm = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: '',
      type: 'number',
      weight: 0,
    },
  });

  const handleAddVariable = (data: z.infer<typeof variableSchema>) => {
    if (editingVariable) {
      // Update variable name in all rows if name changed
      if (editingVariable.name !== data.name) {
        const updatedRows = rows.map((row) => {
          const newValues = { ...row.values };
          if (editingVariable.name in newValues) {
            newValues[data.name] = newValues[editingVariable.name];
            delete newValues[editingVariable.name];
          }
          return {
            ...row,
            values: newValues,
          };
        });
        setRows(updatedRows);
      }

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

  const handleDeleteVariable = () => {
    if (editingVariable) {
      setVariables(variables.filter((v) => v.id !== editingVariable.id));
      setEditingVariable(null);
      setOpenVariableDialog(false);
      toast.success('Variable deleted successfully');
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

  const handleVariableDialogOpenChange = (open: boolean) => {
    setOpenVariableDialog(open);
    if (!open) {
      setEditingVariable(null);
    }
  };

  const sortedVariables = [...variables].sort((a, b) => b.weight - a.weight);
  const totalWeight = variables.reduce((acc, v) => acc + v.weight, 0);

  return (
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
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedVariables.map((v) => (
                          <TableRow key={v.id} className="group hover:bg-muted">
                            <TableCell>{v.name}</TableCell>
                            <TableCell>
                              {v.type === 'boolean' ? 'True/False' : 'Number'}
                            </TableCell>
                            <TableCell>{v.weight}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="invisible group-hover:visible"
                                onClick={() => startEditingVariable(v)}
                              >
                                <LuPencil className="size-4" />
                              </Button>
                            </TableCell>
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

      <Dialog
        open={openVariableDialog}
        onOpenChange={handleVariableDialogOpenChange}
      >
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
    </Accordion>
  );
}
