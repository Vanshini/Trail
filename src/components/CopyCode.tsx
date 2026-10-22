import { toast } from 'sonner';

export default function CopyCode({ code }: { code: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied');
      }}
      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/5 py-4 text-3xl font-black tracking-[0.35em] hover:bg-white/10 transition"
    >
      {code}
    </button>
  );
}