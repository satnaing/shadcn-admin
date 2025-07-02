import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconCalendar, IconDownload } from '@tabler/icons-react';
import { Input } from '@/components/ui/input'
import axios from 'axios';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

export function DownloadExcelDialog() {
  
  const [fields, setFields] = useState({ start_date: '', end_date: '' });
  const [downloading, setDownloading] = useState(false);

  const handleReset = () => {
    setFields({ start_date: '', end_date: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    let { start_date, end_date } = fields;
    if (!start_date && !end_date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const currentDate = `${yyyy}-${mm}-${dd}`;
      start_date = currentDate;
      end_date = currentDate;
      setFields({ start_date, end_date });
    }
    setDownloading(true);
    try {
      const token = getToken();
      const params = {
        ...fields,
        start_date,
        end_date,
        isDownload: true,
      };
      const response = await axios.get(
        `${BACKEND_BASE_URL}/v1/bbps/getAllTransactions`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
          withCredentials: true,
        }
      );
      const blob = new Blob([response.data]);
      if (blob.size < 2000) {
        alert('No transactions found for the selected range.');
        setDownloading(false);
        return;
      }
      // Extract filename from Content-Disposition header
      let filename = 'bbps-transactions.xlsx';
      const disposition = response.headers['content-disposition'];
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      // Create a blob and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (_err) {
      alert('Failed to download Excel.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconDownload className="mr-1"  />
          Download Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Download Transactions as Excel</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
          <label className='mb-1 block text-xs font-semibold'>Start Date</label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconCalendar size={18} />
            </span>
            <Input
              name='start_date'
              value={fields.start_date}
              onChange={handleChange}
              placeholder='YYYY-MM-DD'
              className='pl-8'
            />
          </div>
          </div>
          <div className="flex flex-col gap-2">
          <label className='mb-1 block text-xs font-semibold'>End Date</label>
          <div className='relative'>
            <span className='absolute top-1/2 left-2 -translate-y-1/2 text-gray-400'>
              <IconCalendar size={18} />
            </span>
            <Input
              name='end_date'
              value={fields.end_date}
              onChange={handleChange}
              placeholder='YYYY-MM-DD'
              className='pl-8'
            />
          </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="outline" type="button" onClick={handleReset} disabled={downloading}>Reset</Button>
          <Button type="button" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Downloading...' : 'Download Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
