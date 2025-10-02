"use client";

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { StepBack } from 'lucide-react';

import axios from 'axios';

import { toast } from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useLoader } from '@/app/contexts/LoaderContext';

// interface de leads
interface LeadDetails {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    dataNascimento: string;
    mensagem: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    createdAt: string;
}

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null; // não renderiza se o valor for nulo ou vazio

    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-md text-gray-900">{value}</p>
        </div>
    );
};

export default function LeadDetailPage() {
    const [lead, setLead] = useState<LeadDetails | null>(null);
    const { showLoader, hideLoader } = useLoader();

    const router = useRouter();
    const params = useParams();

    const { id } = params;

    useEffect(() => {
        const fetchLeadDetails = async () => {
            if (!id) return;

            showLoader();

            try {
                const token = localStorage.getItem('authToken');

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLead(response.data);
            } catch (_error) {
                toast.error('Não foi possível carregar os detalhes do lead.');

                router.push('/admin/dashboard');
            } finally {
                hideLoader();
            }
        };

        fetchLeadDetails();
    }, [id, router]);

    if (!lead) {
        return <p className="text-center p-8">Lead não encontrado.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/admin/dashboard">
                        <StepBack className="mr-2 h-4 w-4" /> Voltar para o Dashboard
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Detalhes do Lead: {lead.nome}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="Nome Completo" value={lead.nome} />
                                <DetailItem label="Email" value={lead.email} />
                                <DetailItem label="Telefone" value={lead.telefone} />
                                <DetailItem label="Cargo" value={lead.cargo} />
                                <DetailItem label="Data de Nascimento" value={new Date(lead.dataNascimento).toLocaleDateString('pt-BR')} />
                                <DetailItem label="Data de Cadastro" value={new Date(lead.createdAt).toLocaleString('pt-BR')} />
                            </div>

                            <div className="mt-6">
                                <DetailItem label="Mensagem" value={lead.mensagem} />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Dados de Tracking (UTMs)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="UTM Source" value={lead.utm_source} />
                                <DetailItem label="UTM Medium" value={lead.utm_medium} />
                                <DetailItem label="UTM Campaign" value={lead.utm_campaign} />
                                <DetailItem label="UTM Term" value={lead.utm_term} />
                                <DetailItem label="UTM Content" value={lead.utm_content} />
                                <DetailItem label="Google Click ID (gclid)" value={lead.gclid} />
                                <DetailItem label="Facebook Click ID (fbclid)" value={lead.fbclid} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}