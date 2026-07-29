import {
  Play, Lock, Compass, Network, Terminal, Check,
  Shield, Search, Brain, Skull, Globe, Sigma, Cpu, Bot, Zap, Gauge, Layers, Swords,
} from "lucide-react";
import Image from "next/image";

export const IconMap: Record<string, React.ReactNode> = {
  compass: <Compass />,
  network: <Network />,
  terminal: <Terminal />,
  play: <Play />,
  lock: <Lock />,
  checkBold: <Check strokeWidth={3} />,
  shield: <Shield />,
  search: <Search />,
  brain: <Brain />,
  skull: <Skull />,
  globe: <Globe />,
  sigma: <Sigma />,
  cpu: <Cpu />,
  bot: <Bot />,
  zap: <Zap />,
  gauge: <Gauge />,
  layers: <Layers />,
  swords: <Swords />,
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
