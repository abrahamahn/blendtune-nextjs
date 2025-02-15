"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsWrapperProps {
  onParamsReady: (token: string | null) => void;
}

const SearchParamsWrapper: React.FC<SearchParamsWrapperProps> = ({ onParamsReady }) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  React.useEffect(() => {
    onParamsReady(token);
  }, [token, onParamsReady]);

  return null;
};

export default SearchParamsWrapper;
