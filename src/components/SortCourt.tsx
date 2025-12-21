import { useState } from 'react';
import { SortCourtProps } from '@/types/sortCourt';

export default function SortCourt({ value, onChange, live }: SortCourtProps) {
    return (
        <div className="mb-4">
            <label htmlFor="courtFilter" className="block text-sm font-medium text-white-700 mb-1">
                Ordenar por Hora
            </label>
            <select
                id="courtFilter"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-card py-2 px-5 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
                <option value="maisProximos">{live ? ('Há Pouco') : ('Mais Próximos')}</option>
                <option value="maisDistantes">{live ? ('Há Algum Tempo') : ('Mais Distantes')}</option>
            </select>
        </div>
    );
}