import { redirect } from 'next/navigation';

export default async function MyProfilePage() {
  redirect('/profiles/owner-avery');
}
