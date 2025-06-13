import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UsersSearchProps {
  onSearch: (params: { id: string; email: string; phone: string; createdAt: string }) => void;
  onReset: () => void;
}

export function UsersSearch({ onSearch, onReset }: UsersSearchProps) {
  const [fields, setFields] = useState({
    id: '',
    email: '',
    phone: '',
    createdAt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log(fields)
    onSearch(fields);
  };
  const handleReset = () => {
    setFields({ id: '', email: '', phone: '', createdAt: '' });
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs mb-1">User ID</label>
        <Input name="id" value={fields.id} onChange={handleChange} placeholder="User ID" />
      </div>
      <div>
        <label className="block text-xs mb-1">Email</label>
        <Input name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
      </div>
      <div>
        <label className="block text-xs mb-1">Phone</label>
        <Input name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone" />
      </div>
      <div>
        <label className="block text-xs mb-1">Created Date</label>
        <Input name="createdAt" value={fields.createdAt} onChange={handleChange} placeholder="YYYY-MM-DD" />
      </div>
      <Button type="submit" className="h-9">Search</Button>
      <Button type="button" variant="outline" className="h-9" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
}