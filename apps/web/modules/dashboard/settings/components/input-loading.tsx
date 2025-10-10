"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import { Skeleton } from "@meetzeen/ui/src/components/skeleton";

export function InputLoading() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-56" />
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-64" />
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}