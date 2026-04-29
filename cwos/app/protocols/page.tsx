import type { Metadata } from 'next';
import ProtocolsClient from './ProtocolsClient';

export const metadata: Metadata = { title: 'Protocols' };

export default function ProtocolsPage() {
  return <ProtocolsClient />;
}
