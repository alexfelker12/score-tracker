import { permanentRedirect } from 'next/navigation';

export default async function UserPage() {
  permanentRedirect('/user/profile');
}