"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted/80 text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-1 shadow-sm backdrop-blur-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-primary dark:data-[state=active]:text-primary focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:outline-ring dark:data-[state=active]:border-primary/20 dark:data-[state=active]:bg-primary/10 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-md data-[state=active]:border-primary/30 hover:bg-primary/5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none transition-all duration-200 animate-in fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
