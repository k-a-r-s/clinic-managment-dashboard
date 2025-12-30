import { RoomsList } from "./RoomsList";

interface RoomsPageProps {
  onCreateNew?: () => void;
  onEditRoom?: (roomId: string) => void;
}

export function RoomsPage({ onCreateNew, onEditRoom }: RoomsPageProps) {
  return <RoomsList onCreateNew={onCreateNew} onEditRoom={onEditRoom} />;
}

export default RoomsPage;
