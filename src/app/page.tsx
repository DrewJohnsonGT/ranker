'use client';

import Image from 'next/image';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { AppStateDialog } from '~/components/AppStateDialog';
import { DataCard } from '~/components/DataCard';
import { Button } from '~/components/ui/Button';
import { ScrollArea } from '~/components/ui/ScrollArea';
import { Separator } from '~/components/ui/Separator';
import { VariablesCard } from '~/components/VariablesCard';
import {
  NAME_OF_ROW,
  OPEN_ROW_DIALOG_QUERY_KEY,
  OPEN_VARIABLE_DIALOG_QUERY_KEY,
} from '~/utils/constants';

export default function Home() {
  const [, setOpenVariableDialog] = useQueryState(
    OPEN_VARIABLE_DIALOG_QUERY_KEY,
    parseAsBoolean.withDefault(false),
  );
  const [, setOpenRowDialog] = useQueryState(
    OPEN_ROW_DIALOG_QUERY_KEY,
    parseAsBoolean.withDefault(false),
  );
  return (
    <div className="">
      <div className="flex items-center gap-2 px-2">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="mr-auto text-3xl font-bold">Rankings</h1>
        <AppStateDialog />
        <Button onClick={() => setOpenVariableDialog(true)}>
          Add Variable
        </Button>
        <Button onClick={() => setOpenRowDialog(true)}>
          Add {NAME_OF_ROW}
        </Button>
      </div>
      <Separator className="w-full flex-1" />
      <ScrollArea className="flex-1">
        <div className="flex flex-wrap gap-2 p-2">
          <VariablesCard />
          <DataCard />
        </div>
      </ScrollArea>
    </div>
  );
}
