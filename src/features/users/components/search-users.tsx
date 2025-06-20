import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UsersSearchProps {
  onSearch: (params: { userId: string; email: string; phone: string; createdAt: string }) => void;
  onReset: () => void;
}

export function UsersSearch({ onSearch, onReset }: UsersSearchProps) {
  const [fields, setFields] = useState({
    userId: '',
    email: '',
    phone: '',
    createdAt: '',
  });
  const [errors, setErrors] = useState({
    userId: '',
    email: '',
    phone: '',
    createdAt: '',
  });

  // Validation helpers
  const isDigits = (val: string) => /^\d*$/.test(val);
  const isDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val);
  const isEmail = (val: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'userId') {
      if (!isDigits(value)) error = 'Only digits allowed';
    }
    if (name === 'phone') {
      if (!isDigits(value)) {
        error = 'Only digits allowed';
      } else if (value && value.length !== 10) {
        error = 'Phone must be exactly 10 digits';
      }
    }
    if (name === 'createdAt' && value && !isDate(value)) {
      error = 'Format: YYYY-MM-DD';
    }
    if (name === 'email' && value && !isEmail(value)) {
      error = 'Invalid email format';
    }
    setFields({ ...fields, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation before search
    let valid = true;
    const newErrors = { ...errors };
    if (fields.userId && !isDigits(fields.userId)) {
      newErrors.userId = 'Only digits allowed';
      valid = false;
    }
    if (fields.phone) {
      if (!isDigits(fields.phone)) {
        newErrors.phone = 'Only digits allowed';
        valid = false;
      } else if (fields.phone.length !== 10) {
        newErrors.phone = 'Phone must be exactly 10 digits';
        valid = false;
      }
    }
    if (fields.createdAt && !isDate(fields.createdAt)) {
      newErrors.createdAt = 'Format: YYYY-MM-DD';
      valid = false;
    }
    if (fields.email && !isEmail(fields.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    onSearch(fields);
  };
  const handleReset = () => {
    setFields({ userId: '', email: '', phone: '', createdAt: '' });
    setErrors({ userId: '', email: '', phone: '', createdAt: '' });
    onReset();
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs mb-1">User ID</label>
        <Input name="userId" value={fields.userId} onChange={handleChange} placeholder="User ID" inputMode="numeric" />
        {errors.userId && <span className="text-xs text-red-500">{errors.userId}</span>}
      </div>
      <div>
        <label className="block text-xs mb-1">Email</label>
        <Input name="email" value={fields.email} onChange={handleChange} placeholder="Email" type="email" />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
      </div>
      <div>
        <label className="block text-xs mb-1">Phone</label>
        <Input name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone" inputMode="numeric" className={errors.phone ? 'border-red-500' : ''} />
        {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
      </div>
      <div>
        <label className="block text-xs mb-1">Created Date</label>
        <Input name="createdAt" value={fields.createdAt} onChange={handleChange} placeholder="YYYY-MM-DD" />
        {errors.createdAt && <span className="text-xs text-red-500">{errors.createdAt}</span>}
      </div>
      <Button type="submit" className="h-9">Search</Button>
      <Button type="button" variant="outline" className="h-9" onClick={handleReset}>
        Reset
      </Button>
    </form>
  );
}