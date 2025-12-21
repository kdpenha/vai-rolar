import { useState } from 'react';
import SearchInput from './SearchInput';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import SortCourt from './SortCourt';

interface FilterDropdownProps {
    dateFilter: string;
    setDateFilter: (v: string) => void;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    onApply: (filters: { searchTerm: string; dateFilter: string }) => void;
    live?: boolean
};

export default function FilterDropdown({ dateFilter, setDateFilter, searchTerm, setSearchTerm, onApply, live }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
        <Button onClick={() => setOpen(!open)}>
            <Search></Search>
        </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-md bg-card shadow-lg p-4 z-10 border border-gray-600">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <SortCourt value={dateFilter} onChange={setDateFilter} live={live} />

          <Button onClick={() => {
                onApply({ searchTerm, dateFilter })
                setOpen(false)
            }} className='w-full mt-3 py-2 px-3 rouded-md'>Aplicar</Button>
        </div>
      )}
    </div>
  );
}
