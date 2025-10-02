"use client";

import { useEffect, useState, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import { toast } from 'react-hot-toast';

import axios from 'axios';

import { IMaskInput } from 'react-imask';

import { useForm } from '../hooks/useForm';
import { isEmail, isPhone, isDate } from '../lib/validations';
import { trackLeadGeneration } from '../lib/gtm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { useLoader } from '../contexts/LoaderContext';

const initialValues = {
    nome: '', email: '', telefone: '', cargo: '', dataNascimento: '', mensagem: '',
    utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '',
    utm_content: '', gclid: '', fbclid: '',
};

export default function PublicForm() {
    const searchParams = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showLoader, hideLoader } = useLoader();

    const { values, errors, handleChange, handleSubmit, setValues, setValueByName } = useForm({
        initialValues,
        validations: {
            nome: { required: true },
            email: { required: true, validate: isEmail },
            telefone: { required: true, validate: isPhone },
            cargo: { required: true },
            dataNascimento: { required: true, validate: isDate },
            mensagem: { required: true },
        },
        onSubmit: async (data) => {
            showLoader();

            setIsSubmitting(true);

            try {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leads`, data);

                toast.success('Lead cadastrado com sucesso!');

                setIsSuccess(true);

                trackLeadGeneration({
                    email: data.email as string,
                    phone: data.telefone as string,
                });
            } catch (_error) {
                toast.error('Erro ao cadastrar lead. Tente novamente.');
            } finally {
                hideLoader();

                setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const trackingParams: { [key: string]: string | null } = {};

        searchParams.forEach((value, key) => {
            if (key in initialValues) {
                trackingParams[key] = value;
            }
        });

        if (Object.keys(trackingParams).length > 0) {
            setValues(prev => ({ ...prev, ...trackingParams }));
        }
    }, [searchParams, setValues]);

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-600">Obrigado!</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p>Seu cadastro foi enviado com sucesso.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Cadastre-se para Receber Novidades</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome Completo</Label>

                            <Input id="nome" placeholder="Seu nome completo" name="nome" value={values.nome} onChange={handleChange} />

                            {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>

                            <Input id="email" placeholder="seu@email.com" name="email" type="email" value={values.email} onChange={handleChange} />

                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>

                            <IMaskInput
                                id="telefone"
                                mask="(00) 00000-0000"
                                value={values.telefone}
                                onAccept={(value) => setValueByName('telefone', value)}
                                placeholder="(99) 99999-9999"
                                name="telefone"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />

                            {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cargo">Cargo</Label>

                            <Input id="cargo" placeholder="Seu cargo atual" name="cargo" value={values.cargo} onChange={handleChange} />

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
                                placeholder="Deixe sua mensagem aqui"
                                name="mensagem"
                                value={values.mensagem}
                                onChange={handleChange}
                                className="w-full p-2 border rounded min-h-[100px] resize-none"
                            ></textarea>

                            {errors.mensagem && <p className="text-red-500 text-sm">{errors.mensagem}</p>}
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}