// components/ClientLoadingWrapper.js
"use client"; // This directive makes the component a client component

import Loading from "@/app/loading";
import { useEffect, useState } from "react";

const LoadingState = ({ children }: any) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const originalConsoleLog = console.log;

        console.log = (...args) => {
            if (args.some(arg => typeof arg === 'string' && arg.includes('[Fast Refresh] rebuilding'))) {
                setIsLoading(true);
            }
            originalConsoleLog(...args);
        };

        // Reset console.log to original after component unmount
        return () => {
            console.log = originalConsoleLog;
        };
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            {children}
        </>
    );
};

export default LoadingState;