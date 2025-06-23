// import { useState } from 'react';
// import { Input } from '@/components/ui/input'; // If you have a custom Input component, else use <input>
// import { Customer } from '../data/schema';

// interface SearchFilterProps {
//   data: Customer[];
//   onFilter: (filtered: Customer[]) => void;
// }

// export function SearchFilter({ data, onFilter }: SearchFilterProps) {
//   const [query, setQuery] = useState('');

//   // Filter customers by any column (case-insensitive)
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setQuery(value);

//     if (!value) {
//       onFilter(data);
//       return;
//     }

//     const filtered = data.filter((customer) =>
//       Object.values(customer)
//         .join(' ')
//         .toLowerCase()
//         .includes(value.toLowerCase())
//     );
//     onFilter(filtered);
//   };

//   return (
//     <Input
//       type="text"
//       placeholder="Search customers..."
//       value={query}
//       onChange={handleChange}
//       className="w-64"
//     />
//   );
// }


import { Input } from '@/components/ui/input';

export function SearchFilter({ table }: { table: any }) {
  // You can filter by a specific column, or multiple columns if needed
  const value = (table.getColumn('search')?.getFilterValue() as string) ?? '';

  return (
    <Input
      type="text"
      placeholder="Search customers..."
      value={value}
      onChange={e => table.getColumn('search')?.setFilterValue(e.target.value)}
      className="w-64"
    />
  );
}