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
  const chartData = rows.map((row) => ({
    name: row.name,
    score: Number((row.score || 0).toFixed(2)),
  }));

  return (
    <Card className="max-w-xl p-0">
      <CardHeader>
        <CardTitle>Rankings</CardTitle>
        <CardDescription>Sorted by score</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
              right: 20,
            }}
            height={rows.length * 50}
          >
            <XAxis
              type="number"
              domain={[0, maxScore]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="score"
              fill="var(--color-score)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {rows[0]?.name} is ranked highest with {rows[0]?.score?.toFixed(1)}{' '}
          points
          <LuTrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing rankings for {rows.length} items
        </div>
      </CardFooter>
    </Card>
  );
}
