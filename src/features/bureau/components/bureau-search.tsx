import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BureauSearchProps {
  onSearch: (params: { score?: string; reportId?: string; bureauType?: string }) => void;
  onReset: () => void;
}

export function BureauSearch({ onSearch, onReset }: BureauSearchProps) {
  const [fields, setFields] = useState({
    score: '',
    reportId: '',
    bureauType: '',
  });

  const isAnyFieldFilled = Object.values(fields).some((v) => v.trim() !== '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      score: fields.score.trim() || undefined,
      reportId: fields.reportId.trim() || undefined,
      bureauType: fields.bureauType.trim() || undefined,
    });
  };
  const handleReset = () => {
    setFields({ score: '', reportId: '', bureauType: '' });
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs mb-1">Score</label>
        <Input name="score" value={fields.score} onChange={handleChange} placeholder="Score" />
      </div>
      <div>
        <label className="block text-xs mb-1">Report ID</label>
        <Input name="reportId" value={fields.reportId} onChange={handleChange} placeholder="Report ID" />
      </div>
      <div>
        <label className="block text-xs mb-1">Bureau Type</label>
        <Input name="bureauType" value={fields.bureauType} onChange={handleChange} placeholder="Bureau Type" />
      </div>
      <Button type="submit" className="h-9" disabled={!isAnyFieldFilled}>Search</Button>
      <Button type="button" variant="outline" className="h-9" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
}
