import { ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  logo?: ReactNode;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, logo, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md border-zinc-700">
      <div className="px-4 py-4">
        <div className="flex justify-between py-2 px-1 truncate">
          <div className="">
            <h3 className="mb-1 text-xl font-bold">{title}</h3>
            <p className="text-zinc-300">{description}</p>
          </div>
          <div className='mr-4'>
            {logo}
          </div>
        </div>
        <div className="py-2 px-1">
          {children}
        </div>
      </div>
      <div className="text-sm p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}