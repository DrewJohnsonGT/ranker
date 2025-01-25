'use client';

import { LuTrendingUp } from 'react-icons/lu';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/Chart';
import { RowData } from '~/types';
import { NAME_OF_ROW } from '~/utils/constants';

interface RankedBarsProps {
  rows: RowData[];
  maxScore: number;
}

const chartConfig = {
  score: {
    label: 'Score',
    theme: {
      light: 'hsl(var(--chart-blue))',
      dark: 'hsl(var(--chart-blue))',
    },
  },
} satisfies ChartConfig;

export function RankedBars({ rows, maxScore }: RankedBarsProps) {
  const chartData = rows.map((row, index) => ({
    name: row.name,
    score: Number((row.score || 0).toFixed(2)),
    fill: `var(--chart-color-${(index % 10) + 1})`,
  }));

  return (
    <Card className="min-w-96 max-w-xl flex-1 px-2">
      <CardHeader>
        <CardTitle className="text-2xl">{NAME_OF_ROW} Rankings</CardTitle>
        <CardDescription>Sorted by score</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            height={rows.length * 50}
          >
            <XAxis
              type="number"
              domain={[0, maxScore]}
              tickFormatter={() => ''}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={40}
              axisLine={false}
              width={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} fillOpacity={0.9} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {rows[0]?.name} is ranked highest with {rows[0]?.score?.toFixed(1)}{' '}
          points
          <LuTrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing rankings for {rows.length} {NAME_OF_ROW}s
        </div>
      </CardFooter>
    </Card>
  );
}
