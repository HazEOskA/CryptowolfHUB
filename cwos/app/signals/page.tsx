import type { Metadata } from 'next';
import SignalsClient from './SignalsClient';

export const metadata: Metadata = { title: 'Signals' };

export default function SignalsPage() {
  return <SignalsClient />;
}
