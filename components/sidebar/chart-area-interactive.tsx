"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  enrollments : {
    label : "Inscriptions",
    color : "var(--chart-1)" , 

  }
} satisfies ChartConfig

interface ChartBarInterface {
  data : {
    date : string ; 
    enrollments : number ; 
  }[]
}

export function ChartBarInteractive({data} : ChartBarInterface) {
  const totalEnrollmentNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  )
  return (
    <Card>
      <CardHeader >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0">
          <CardTitle>Nombre total d&apos;inscriptions </CardTitle>
          <CardDescription>
            <span className=" @[540]/card:hidden">
              Total d&apos; inscription durant les 30 derniers : {totalEnrollmentNumber}
            </span>

            <span className="hidden @[540]/card:block">30 derniers jours : {totalEnrollmentNumber} </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            margin={{
              left : 12 , 
              right : 12
            }}
            data = {data}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={"enrollments"} fill={`var(--color-enrollments`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
