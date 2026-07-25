import {
  Sun, Moon, Github, Globe, ChevronRight, ChevronLeft,
  Clock, BookOpen, CheckCircle, Circle, Play, Wrench,
  Flame, Star, ExternalLink, FileText, MessageSquare,
  Copy, Check, Lock, Compass, Network, Terminal, Square,
  CheckSquare, AlertTriangle, ArrowRight, Video, File,
  Layers, List, BookOpenCheck,
} from "lucide-react";
import Image from "next/image";

export const IconMap: Record<string, React.ReactNode> = {
  sun: <Sun className="text-yellow-400" />,
  moon: <Moon />,
  github: <Github />,
  globe: <Globe />,
  chevronRight: <ChevronRight />,
  chevronLeft: <ChevronLeft />,
  clock: <Clock />,
  bookOpen: <BookOpen />,
  checkCircle: <CheckCircle />,
  circle: <Circle />,
  play: <Play />,
  wrench: <Wrench />,
  flame: <Flame />,
  star: <Star />,
  externalLink: <ExternalLink />,
  fileText: <FileText />,
  messageSquare: <MessageSquare />,
  copy: <Copy />,
  check: <Check />,
  checkBold: <Check strokeWidth={3} />,
  lock: <Lock />,
  compass: <Compass />,
  network: <Network />,
  terminal: <Terminal />,
  checkSquare: <CheckSquare />,
  alertTriangle: <AlertTriangle />,
  arrowRight: <ArrowRight />,
  video: <Video />,
  file: <File />,
  layers: <Layers />,
  list: <List />,
  bookOpenCheck: <BookOpenCheck />,
  python: (
    <Image src="/python-logo.png" alt="Python" width={14} height={14} className="object-contain" />
  ),
};

export function Icon({
  name,
  className,
  size = 14,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  if (name === "python") {
    return (
      <span className={className} style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Image src="/python-logo.png" alt="Python" width={size} height={size} className="object-contain" />
      </span>
    );
  }
  const base = IconMap[name];
  if (!base) return <Compass style={{ width: size, height: size }} />;
  const el = base as React.ReactElement;
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, flexShrink: 0 }}
    >
      {el.type && typeof el.type !== "string"
        ? <el.type {...el.props} style={{ ...el.props.style, width: size, height: size }} />
        : el}
    </span>
  );
}
