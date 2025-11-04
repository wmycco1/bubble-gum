import type { FormProps } from '@/types/components';
import { Button } from '../ui/button';

export function FormComponentView({ props }: { props: FormProps }) {
  return (
    <div className="px-6 py-8">
      <form className="mx-auto max-w-lg space-y-6">
        {props.fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-slate-900"
            >
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full">
          {props.submitText}
        </Button>
      </form>
    </div>
  );
}
