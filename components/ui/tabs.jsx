"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props} />)
  );
}

// tabs.jsx
function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex flex-row md:flex-col gap-2 w-full font-poppins",
        className
      )}
      {...props}
    />
  );
}


function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `relative px-4 py-2 rounded-xl w-full md:text-left font-semibold text-[var(--text-secondary)] border border-[var(--border)]
         backdrop-blur-md transition-all duration-300 overflow-hidden group
         hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/30
         data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white data-[state=active]:shadow-lg
         data-[state=active]:scale-[1.03] data-[state=active]:border-[var(--accent)]
         before:absolute before:inset-0 before:rounded-xl before:bg-white/5 before:opacity-0 group-hover:before:opacity-10 before:transition-all text-center`,
        className
      )}
      {...props}
    />
  );
}



function TabsContent({
  className,
  ...props
}) {
  return (
    (<TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props} />)
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
