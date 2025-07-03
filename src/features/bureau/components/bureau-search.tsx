import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


interface BureauSearchParams {
  name?: string;
  customer_id?: number;
  bureau_id?: number;
  start_date?: string;
  end_date?: string;
  pull_source?: string;
  score?: number;
}

interface BureauSearchProps {
  onSearch: (params: BureauSearchParams) => void;
  onReset: () => void;
}

export function BureauSearch({ onSearch, onReset }: BureauSearchProps) {
  const [fields, setFields] = useState({
    name: '',
    customer_id: '',
    bureau_id: '',
    start_date: '',
    end_date: '',
    pull_source: '',
    score: '',
  });

  const isAnyFieldFilled = Object.values(fields).some((v) => v.trim() !== '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      name: fields.name.trim() || undefined,
      customer_id: fields.customer_id.trim() ? Number(fields.customer_id.trim()) : undefined,
      bureau_id: fields.bureau_id.trim() ? Number(fields.bureau_id.trim()) : undefined,
      start_date: fields.start_date.trim() || undefined,
      end_date: fields.end_date.trim() || undefined,
      pull_source: fields.pull_source.trim() || undefined,
      score: fields.score.trim() ? Number(fields.score.trim()) : undefined,
    });
  };
  const handleReset = () => {
    setFields({
      name: '',
      customer_id: '',
      bureau_id: '',
      start_date: '',
      end_date: '',
      pull_source: '',
      score: '',
    });
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs mb-1">Name</label>
        <Input name="name" value={fields.name} onChange={handleChange} placeholder="Name" />
      </div>
      <div>
        <label className="block text-xs mb-1">Customer ID</label>
        <Input name="customer_id" value={fields.customer_id} onChange={handleChange} placeholder="Customer ID" />
      </div>
      <div>
        <label className="block text-xs mb-1">Bureau ID</label>
        <Input name="bureau_id" value={fields.bureau_id} onChange={handleChange} placeholder="Bureau ID" />
      </div>
      <div>
        <label className="block text-xs mb-1">Start Date</label>
        <Input name="start_date" value={fields.start_date} onChange={handleChange} placeholder="Start Date" />
      </div>
      <div>
        <label className="block text-xs mb-1">End Date</label>
        <Input name="end_date" value={fields.end_date} onChange={handleChange} placeholder="End Date" />
      </div>
      <div>
        <label className="block text-xs mb-1">Pull Source</label>
        <Input name="pull_source" value={fields.pull_source} onChange={handleChange} placeholder="Pull Source" />
      </div>
      <div>
        <label className="block text-xs mb-1">Score</label>
        <Input name="score" value={fields.score} onChange={handleChange} placeholder="Score" />
      </div>
      <Button type="submit" className="h-9" disabled={!isAnyFieldFilled}>Search</Button>
      <Button type="button" variant="outline" className="h-9" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
}
