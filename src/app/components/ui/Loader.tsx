"use client";

export default function Loader({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
        </div>
    );
}