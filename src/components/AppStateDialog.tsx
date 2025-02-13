'use client';

import { useState } from 'react';
import { LuSave, LuUpload } from 'react-icons/lu';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/AlertDialog';
import { Button } from '~/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/Select';
import { useLocalStorageState } from '~/hooks/useLocalStorageState';
import { AppState, RowData, VariableDefinition } from '~/types';
import {
  DEFAULT_ROWS,
  DEFAULT_VARIABLES,
  LAST_LOADED_STATE_LOCAL_STORAGE_KEY,
  SAVED_STATES_LOCAL_STORAGE_KEY,
} from '~/utils/constants';

export function AppStateDialog({
  variables,
  rows,
  setVariables,
  setRows,
}: {
  variables: VariableDefinition[];
  rows: RowData[];
  setVariables: (variables: VariableDefinition[]) => void;
  setRows: (rows: RowData[]) => void;
}) {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openLoadDialog, setOpenLoadDialog] = useState(false);
  const [stateName, setStateName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [lastLoadedState, setLastLoadedState] = useLocalStorageState<string>(
    LAST_LOADED_STATE_LOCAL_STORAGE_KEY,
    '',
  );

  const [savedStates, setSavedStates] = useLocalStorageState<
    Record<string, AppState>
  >(SAVED_STATES_LOCAL_STORAGE_KEY, {
    DEFAULT: {
      variables: DEFAULT_VARIABLES,
      rows: DEFAULT_ROWS,
    },
  });

  const getCurrentState = () => {
    return {
      variables,
      rows,
    };
  };

  const handleSave = () => {
    if (!stateName) return;

    const newSavedStates = {
      ...savedStates,
      [stateName]: getCurrentState(),
    };
    setSavedStates(newSavedStates);
    setStateName('');
    setOpenSaveDialog(false);
    toast.success(`State "${stateName}" saved successfully`);
  };

  const handleLoad = () => {
    if (!selectedState) return;

    const stateToLoad = savedStates[selectedState];

    setVariables(stateToLoad?.variables ?? []);
    setRows(stateToLoad?.rows ?? []);
    setLastLoadedState(selectedState);
    setSelectedState('');
    setOpenLoadDialog(false);
    toast.info(`Loaded state "${selectedState}"`);
    window.location.reload();
  };

  const savedStatesList = Object.keys(savedStates);

  return (
    <div className="flex items-center gap-2">
      {lastLoadedState && (
        <div className="text-sm text-muted-foreground">
          Last loaded: {lastLoadedState}
        </div>
      )}
      <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
        <Button variant="outline" onClick={() => setOpenSaveDialog(true)}>
          <LuSave className="mr-2 size-4" />
          Save State
        </Button>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current State</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter state name"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openLoadDialog} onOpenChange={setOpenLoadDialog}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenLoadDialog(true)}
            disabled={savedStatesList.length === 0}
          >
            <LuUpload className="mr-2 size-4" />
            Load State
          </Button>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load Saved State</AlertDialogTitle>
            <AlertDialogDescription>
              This will override your current state. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select onValueChange={setSelectedState} value={selectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select a saved state" />
            </SelectTrigger>
            <SelectContent>
              {savedStatesList.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoad}>Load</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
