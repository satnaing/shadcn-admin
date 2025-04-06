// CompaniesActionDialog.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { companyFormSchema, CompanyForm as CompanyForm1, companyFieldMetadata, CompanyFormFieldType } from '../data/newSchema';
import { Company } from '../data/schema';
import { useInsertCompanyMutation } from '../services/insertCompany';
import { useUpdateCompanyMutation } from '../services/updateCompany';
import React from 'react';
import { CompanyFormField } from './companiesActionField';

const formSchema = companyFormSchema;
type CompanyForm = CompanyForm1;

interface Props {
  currentRow?: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompaniesActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const defaultValues = React.useMemo(
    () =>
      isEdit
        ? { ...currentRow, isEdit }
        : {
            company_name: '',
            hr_manager_name: '',
            hr_manager_phone: '',
            company_address: '',
            isEdit,
          },
    [currentRow, isEdit]
  );

  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  const { mutate: insertCompany, isLoading } = useInsertCompanyMutation();
  const { mutate: updateCompany } = useUpdateCompanyMutation();

  const onSubmit = async (value: CompanyForm) => {
    if (isEdit) {
      await updateCompany({
        company_id: currentRow.company_id,
        company_name: value.company_name,
        hr_manager_name: value.hr_manager_name,
        hr_manager_phone: value.hr_manager_phone,
        company_address: value.company_address,
      });
      onOpenChange(false);
    } else {
      await insertCompany({
        company_name: value.company_name,
        hr_manager_name: value.hr_manager_name,
        hr_manager_phone: value.hr_manager_phone,
        company_address: value.company_address,
      });
      form.reset(defaultValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit Company' : 'Add New Company'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the user here. '
              : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-0.5">
              {Object.entries(companyFieldMetadata).map(([name, metadata]) => (
                <CompanyFormField
                  key={name}
                  name={name as CompanyFormFieldType}
                  label={metadata.label}
                  placeholder={metadata.placeholder}
                  control={form.control}
                />
              ))}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="user-form" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
