"use client";

import { useEffect, useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import axios from 'axios';

import { toast } from 'react-hot-toast';

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    PaginationState,
} from '@tanstack/react-table';

import { PlusCircle, Search, Download, Trash2, Eye, Edit, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { useLoader } from '@/app/contexts/LoaderContext';

interface Lead {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    createdAt: string;
}

// hook para debounce
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function DashboardPage() {
    const [data, setData] = useState<{ leads: Lead[], totalPages: number }>({ leads: [], totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // atraso de 300ms para a busca
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const { showLoader, hideLoader } = useLoader();
    const [isLoading, setIsLoading] = useState(true);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const fetchLeads = async (page: number, limit: number, search: string) => {
        showLoader();

        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: page + 1, limit, search },
            });

            setData(response.data);
        } catch (error) {
            toast.error('Sessão expirada. Faça login novamente.');

            localStorage.removeItem('authToken');

            router.push('/login');
        } finally {
            setIsLoading(false);

            hideLoader();
        }
    };

    useEffect(() => {
        fetchLeads(pageIndex, pageSize, debouncedSearchTerm);
    }, [pageIndex, pageSize, debouncedSearchTerm]);

    const handleDelete = async () => {
        if (!leadToDelete) return;

        setIsDeleting(true);

        try {
            const token = localStorage.getItem('authToken');

            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/leads/${leadToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(`Lead "${leadToDelete.nome}" deletado com sucesso!`);

            fetchLeads(pageIndex, pageSize, debouncedSearchTerm); // recarrega os dados
        } catch (error) {
            toast.error('Erro ao deletar lead.');
        } finally {
            setIsDeleting(false);

            setLeadToDelete(null); // fecha o modal
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');

        toast.success('Você saiu da sua conta.');

        router.push('/login');
    };

    const handleExport = async () => {
        showLoader();

        try {
            const token = localStorage.getItem('authToken');

            // a resposta esperada é um blob
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            // cria uma URL temporária para o arquivo recebido
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;

            // define o nome do arquivo para o download
            const fileName = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;

            link.setAttribute('download', fileName);

            document.body.appendChild(link);

            link.click();

            // limpa a URL temporária
            link.parentNode?.removeChild(link);

            window.URL.revokeObjectURL(url);

            toast.success('Download iniciado!');

        } catch (error) {
            toast.error('Ocorreu um erro ao exportar os leads.');

            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const columns = useMemo<ColumnDef<Lead>[]>(() => [
        { accessorKey: 'nome', header: 'Nome' },
        { accessorKey: 'email', header: 'E-mail' },
        { accessorKey: 'telefone', header: 'Telefone' },
        {
            accessorKey: 'createdAt',
            header: 'Data de Criação',
            cell: info => new Date(info.getValue() as string).toLocaleDateString('pt-BR'),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <div className="flex justify-center items-center gap-2">
                    <Link href={`/admin/dashboard/lead/${row.original.id}`} passHref>
                        <Button variant="ghost" size="icon" aria-label="Ver detalhes"><Eye className="h-4 w-4" /></Button>
                    </Link>

                    <Link href={`/admin/dashboard/lead/${row.original.id}/editar`} passHref>
                        <Button variant="ghost" size="icon" aria-label="Editar"><Edit className="h-4 w-4" /></Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => setLeadToDelete(row.original)}
                        aria-label="Deletar"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: data.leads,
        columns,
        pageCount: data.totalPages,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    return (
        <>
            <ConfirmationModal
                isOpen={!!leadToDelete}
                onClose={() => setLeadToDelete(null)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                description={`Tem certeza que deseja deletar o lead "${leadToDelete?.nome}"? Esta ação não pode ser desfeita.`}
                confirmText="Sim, deletar"
                isLoading={isDeleting}
            />

            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard de Leads</h1>

                    <Button onClick={handleLogout} variant="outline">Sair</Button>
                </header>

                <main className="p-4 md:p-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full md:max-w-xs">
                                <Input
                                    type="text"
                                    placeholder="Buscar por nome ou e-mail..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />

                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={() => handleExport()} variant="secondary">
                                    <Download className="mr-2 h-4 w-4" /> Exportar CSV
                                </Button>

                                <Button asChild>
                                    <Link href="/admin/dashboard/lead/novo">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Lead
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} scope="col" className="px-6 py-3">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={columns.length} className="text-center py-4">Carregando...</td></tr>
                                    ) : table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map(row => (
                                            <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={columns.length} className="text-center py-4">Nenhum lead encontrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-700">
                                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                            </span>

                            <div className="flex items-center gap-2">
                                <Button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} variant="outline" size="icon"><ChevronsLeft className="h-4 w-4" /></Button>
                                <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                                <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} variant="outline" size="icon"><ChevronsRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}