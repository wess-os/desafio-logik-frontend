"use client";

import { useLoader } from "../contexts/LoaderContext";

import Loader from "./ui/Loader";

export default function GlobalLoader() {
    const { isLoading } = useLoader();

    return <Loader isLoading={isLoading} />;
}