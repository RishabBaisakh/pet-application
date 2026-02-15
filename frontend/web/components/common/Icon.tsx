import * as RadixIcons from "@radix-ui/react-icons";

type IconProps = {
  name: keyof typeof RadixIcons;
  size?: number;
  color?: string;
  className?: string;
};

export default function Icon({
  name,
  size = 30,
  color = "black",
  className = "",
}: IconProps) {
  const IconComponent = RadixIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in @radix-ui/react-icons`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      className={`text-gray-500 ${className}`}
      style={{ filter: "drop-shadow(0 0 1px currentColor)" }}
    />
  );
}
