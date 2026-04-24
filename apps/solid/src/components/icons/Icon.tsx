const iconModules = import.meta.glob("./*.svg", {
  import: "default",
  eager: true,
}) as Record<string, any>;

const iconMap = Object.keys(iconModules).reduce(
  (acc, path) => {
    const match = path.match(/\/([^/]+)\.svg$/);
    if (match) {
      const iconName = match[1].toLowerCase();
      acc[iconName] = iconModules[path];
    }
    return acc;
  },
  {} as Record<string, any>,
);

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  class?: string;
};

export default function Icon({
  name,
  class: className,
}: IconProps) {
  const normalizedName = name.toLowerCase();
  const IconComponent = iconMap[normalizedName];

  if (!IconComponent) {
    console.warn(
      `Icon "${name}" not found. Available icons:`,
      Object.keys(iconMap),
    );
    return <p>{name[0]}</p>;
  }

  return (
    <IconComponent
      class="transition-all size-full duration-400 group-hover:scale-130"
    />
  );
}
