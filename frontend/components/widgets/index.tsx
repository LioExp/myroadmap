import LinuxArch from "./LinuxArch";
import DistroSelector from "./DistroSelector";
import KsdCards from "./KsdCards";
import DistroGrid from "./DistroGrid";
import LinuxWhere from "./LinuxWhere";
import DistroCmd from "./DistroCmd";

const widgetMap: Record<string, React.ComponentType<Record<string, string>>> = {
  "linux-arch": LinuxArch,
  "distro-selector": DistroSelector,
  "ksd-cards": KsdCards,
  "distro-grid": DistroGrid,
  "linux-where": LinuxWhere,
  "distro-cmd": DistroCmd,
};

export default function WidgetRenderer({
  name,
  query,
}: {
  name: string;
  query?: string;
}) {
  const Component = widgetMap[name];
  if (!Component) return <div className="text-red-400 text-xs">widget desconhecido: {name}</div>;
  const params = new URLSearchParams(query || "");
  const props: Record<string, string> = {};
  params.forEach((v, k) => { props[k] = v; });
  return <Component {...props} />;
}
