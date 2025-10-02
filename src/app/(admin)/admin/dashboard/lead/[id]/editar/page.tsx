"use client";

import { useEffect, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import { StepBack } from 'lucide-react';

import { toast } from 'react-hot-toast';

import { IMaskInput } from 'react-imask';

import axios from 'axios';

import { useForm } from '@/app/hooks/useForm';
import { isEmail, isPhone, isDate } from '@/app/lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Label } from '@/app/components/ui/Label';
import { useLoader } from '@/app/contexts/LoaderContext';

export default function EditLeadPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const router = useRouter();
    const params = useParams();

    const { id } = params;

    const { values, errors, handleChange, handleSubmit, setValues, setValueByName } = useForm({
        initialValues: {
            nome: '', email: '', telefone: '', cargo: '', dataNascimento: '', mensagem: '',
        },
        validations: {
            nome: { required: true },
            email: { required: true, validate: isEmail },
            telefone: { required: true, validate: isPhone },
            cargo: { required: true },
            dataNascimento: { required: true, validate: isDate },
            mensagem: { required: true },
        },
        onSubmit: async (data) => {
            setIsSubmitting(true);
            showLoader();

            try {
                const token = localStorage.getItem('authToken');

                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/leads/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                toast.success('Lead atualizado com sucesso!');

                router.push('/admin/dashboard');
            } catch (_error) {
                toast.error('Erro ao atualizar lead.');
            } finally {
                setIsSubmitting(false);
                hideLoader();
            }
        },
    });

    useEffect(() => {
        const fetchLead = async () => {
            if (!id) return;

            showLoader();

            try {
                const token = localStorage.getItem('authToken');

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // formata a data para o formato YYYY-MM-DD que o input[type=date] espera
                const formattedData = {
                    ...response.data,
                    dataNascimento: new Date(response.data.dataNascimento).toISOString().split('T')[0]
                };

                setValues(formattedData);
            } catch (_error) {
                toast.error('Lead não encontrado.');

                router.push('/admin/dashboard');
            } finally {
                hideLoader();
            }
        };

        fetchLead();
    }, [id, router, setValues]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/admin/dashboard"><StepBack className="mr-2 h-4 w-4" /> Voltar</Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar Lead: {values.nome}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo</Label>

                                <Input id="nome" name="nome" value={values.nome} onChange={handleChange} />
                                {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>

                                <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>

                                <IMaskInput
                                    id="telefone"
                                    mask="(00) 00000-0000"
                                    value={values.telefone}
                                    onAccept={(value) => setValueByName('telefone', value)}
                                    name="telefone"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />

                                {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cargo">Cargo</Label>

                                <Input id="cargo" name="cargo" value={values.cargo} onChange={handleChange} />
                                {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dataNascimento">Data de Nascimento</Label>

                                <Input id="dataNascimento" name="dataNascimento" type="date" value={values.dataNascimento} onChange={handleChange} />

                                {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mensagem">Mensagem</Label>

                                <textarea
                                    id="mensagem"
                                    name="mensagem"
                                    value={values.mensagem}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded min-h-[100px] resize-none"
                                ></textarea>

                                {errors.mensagem && <p className="text-red-500 text-sm">{errors.mensagem}</p>}
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Atualizando...' : 'Salvar Alterações'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}