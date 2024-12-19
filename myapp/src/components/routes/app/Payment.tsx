import ChangeEmail from '@/components/profile/change-email';
import ChangePassword from '@/components/profile/change-password';
import JwtClaims from '@/components/profile/jwt-claims';
import UserInfo from '@/components/profile/user-info';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Table from '@/components/ui/Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const userData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Sam Wilson', email: 'sam@example.com', role: 'Viewer' },
];

// Explicitly typing the columns with `keyof User`
const userColumns: { key: keyof User; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

export default function Payment() {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
    </Card> */}
      <Table columns={userColumns} data={userData} />
    </div>
  );
}
