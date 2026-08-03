import { MembersDirectory } from '@/features/members/components/MembersDirectory';
import CreateMemberButton from '@/features/members/components/CreateMemberButton';

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-main">
            Miembros del sistema
          </h1>
          <p className="text-sm text-text-muted transition-colors">
            Administre todas las membresias activas e inactivas del gimnasio y la información de los miembros.
          </p>
        </div>

        <CreateMemberButton />
      </div>
      <MembersDirectory />
    </div>
  );
}
