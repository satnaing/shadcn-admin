import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomersSearchProps {
  onSearch: (params: { id?: string; email?: string; mobile?: string }) => void;
  onReset: () => void;
}

export function CustomersSearch({ onSearch, onReset }: CustomersSearchProps) {
  const [fields, setFields] = useState({
    id: '',
    email: '',
    mobile: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      id: fields.id.trim() || undefined,
      email: fields.email.trim() || undefined,
      mobile: fields.mobile.trim() || undefined,
    });
  };
  const handleReset = () => {
    setFields({ id: '', email: '', mobile: '' });
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs mb-1">ID</label>
        <Input name="id" value={fields.id} onChange={handleChange} placeholder="ID" />
      </div>
      <div>
        <label className="block text-xs mb-1">Email</label>
        <Input name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
      </div>
      <div>
        <label className="block text-xs mb-1">Mobile</label>
        <Input name="mobile" value={fields.mobile} onChange={handleChange} placeholder="Mobile" />
      </div>
      <Button type="submit" className="h-9">Search</Button>
      <Button type="button" variant="outline" className="h-9" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
}
