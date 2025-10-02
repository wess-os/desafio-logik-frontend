import { Suspense } from 'react';

import PublicForm from './components/PublicForm';
import Loader from './components/ui/Loader';

export default function HomePage() {
    const fallback = (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader isLoading={true} />
        </div>
    );

    return (
        <Suspense fallback={fallback}>
            <PublicForm />
        </Suspense>
    );
}