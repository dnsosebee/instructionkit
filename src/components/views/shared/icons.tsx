import {
  Battery100Icon,
  BeakerIcon,
  BoltIcon,
  BookOpenIcon,
  BugAntIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  CalculatorIcon,
  CameraIcon,
  CodeBracketSquareIcon,
  CommandLineIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  FaceSmileIcon,
  FireIcon,
  FolderIcon,
  GiftIcon,
  GlobeAltIcon,
  HomeIcon,
  LifebuoyIcon,
  MapIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  PrinterIcon,
  PuzzlePieceIcon,
  RadioIcon,
  RocketLaunchIcon,
  TruckIcon,
  TvIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

// some fun heroicons that people can choose between to give spunk to their workspaces
export const ICONS: { [key: string]: React.FC<React.ComponentProps<'svg'>> } = {
  folder: FolderIcon,
  home: HomeIcon,
  rocketLaunch: RocketLaunchIcon,
  battery100: Battery100Icon,
  beaker: BeakerIcon,
  bolt: BoltIcon,
  bookOpen: BookOpenIcon,
  bugAnt: BugAntIcon,
  buildingLibrary: BuildingLibraryIcon,
  buildingStorefront: BuildingStorefrontIcon,
  calculator: CalculatorIcon,
  camera: CameraIcon,
  codeBracketSquare: CodeBracketSquareIcon,
  commandLine: CommandLineIcon,
  cpuChip: CpuChipIcon,
  devicePhone: DevicePhoneMobileIcon,
  faceSmile: FaceSmileIcon,
  fire: FireIcon,
  globeAlt: GlobeAltIcon,
  gift: GiftIcon,
  lifeBuoy: LifebuoyIcon,
  map: MapIcon,
  musicalNote: MusicalNoteIcon,
  paintBrush: PaintBrushIcon,
  printer: PrinterIcon,
  puzzlePiece: PuzzlePieceIcon,
  radio: RadioIcon,
  truck: TruckIcon,
  tv: TvIcon,
  wrenchScrewdriver: WrenchScrewdriverIcon,
}

export const Icon = ({ name, ...props }: { name: string } & React.ComponentProps<'svg'>) => {
  let Icon = ICONS[name]
  if (!Icon) {
    Icon = FolderIcon
  }
  return <Icon {...props} />
}
