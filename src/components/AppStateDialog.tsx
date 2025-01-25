'use client';

import { useState } from 'react';
import { LuSave, LuUpload } from 'react-icons/lu';
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
import {
  ROWS_LOCAL_STORAGE_KEY,
  SAVED_STATES_LOCAL_STORAGE_KEY,
  VARIABLES_LOCAL_STORAGE_KEY,
} from '~/utils/constants';

export function AppStateDialog() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openLoadDialog, setOpenLoadDialog] = useState(false);
  const [stateName, setStateName] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Load current state from localStorage
  const getCurrentState = () => {
    const variables = localStorage.getItem(VARIABLES_LOCAL_STORAGE_KEY);
    const rows = localStorage.getItem(ROWS_LOCAL_STORAGE_KEY);
    return {
      variables: variables ? JSON.parse(variables) : [],
      rows: rows ? JSON.parse(rows) : [],
    };
  };

  // Load saved states from localStorage
  const getSavedStates = () => {
    const savedStates = localStorage.getItem(SAVED_STATES_LOCAL_STORAGE_KEY);
    return savedStates ? JSON.parse(savedStates) : {};
  };

  const handleSave = () => {
    if (!stateName) return;

    const savedStates = getSavedStates();
    savedStates[stateName] = getCurrentState();
    localStorage.setItem(
      SAVED_STATES_LOCAL_STORAGE_KEY,
      JSON.stringify(savedStates),
    );
    setStateName('');
    setOpenSaveDialog(false);
  };

  const handleLoad = () => {
    if (!selectedState) return;

    const savedStates = getSavedStates();
    const stateToLoad = savedStates[selectedState];

    localStorage.setItem(
      VARIABLES_LOCAL_STORAGE_KEY,
      JSON.stringify(stateToLoad.variables),
    );
    localStorage.setItem(
      ROWS_LOCAL_STORAGE_KEY,
      JSON.stringify(stateToLoad.rows),
    );

    setSelectedState('');
    setOpenLoadDialog(false);
    window.location.reload();
  };

  const savedStatesList = Object.keys(getSavedStates());

  return (
    <div className="flex gap-2">
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
        <Button
          variant="outline"
          onClick={() => setOpenLoadDialog(true)}
          disabled={savedStatesList.length === 0}
        >
          <LuUpload className="mr-2 size-4" />
          Load State
        </Button>
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
