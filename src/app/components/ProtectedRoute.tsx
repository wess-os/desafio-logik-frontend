"use client";

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import Loader from './ui/Loader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            // se não houver token, redireciona para o login
            router.replace('/login');
        } else {
            // se houver token, permite a renderização do conteúdo
            setIsVerifying(false);
        }
    }, [router]);

    // enquanto a verificação estiver em andamento, exibe o loader em tela cheia
    if (isVerifying) {
        return <Loader isLoading={true} />;
    }

    // se a verificação foi concluída e o token existe, renderiza a página solicitada
    return <>{children}</>;
}