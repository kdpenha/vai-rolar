import { useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Pesquisar...' }: SearchInputProps) {
  return (
    <div className="mb-4">
        <label htmlFor="" className="block text-sm font-medium text-white-700 mb-1">
            Pesquisar
        </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-md
          border
          border-gray-300
          bg-card
          py-2
          px-3
          shadow-sm
          focus:outline-none
          focus:border-blue-500
          focus:ring
          focus:ring-blue-200
          focus:ring-opacity-50
        "
      />
    </div>
  );
}