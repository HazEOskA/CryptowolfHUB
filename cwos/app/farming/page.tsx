import type { Metadata } from 'next';
import FarmingClient from './FarmingClient';

export const metadata: Metadata = { title: 'Farming' };

export default function FarmingPage() {
  return <FarmingClient />;
}
