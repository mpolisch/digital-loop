"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search"
        className="pl-10 w-64 bg-secondary/50 border-border/20"
      />
    </div>
  );
}
