import { QrGenerator } from '@/components/qr-generator';

export default function Home() {
  return (
    <div className="container relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-8">
      <QrGenerator />
    </div>
  );
}
