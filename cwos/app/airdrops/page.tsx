import type { Metadata } from 'next';
import AirdropsClient from './AirdropsClient';

export const metadata: Metadata = { title: 'Airdrops' };

export default function AirdropsPage() {
  return <AirdropsClient />;
}
