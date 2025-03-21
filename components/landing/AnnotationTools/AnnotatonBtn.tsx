import { Button } from "@/components/ui/button";

interface PropType {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  color: string;
}

const AnnotatonBtn: React.FC<PropType> = ({
  Icon,
  label,
  onClick,
  disabled = false,
  color,
}) => {
  return (
    <Button
      className={`flex flex-col items-center justify-center  md:py-8 cursor-pointer border-black bg-transparent border text-black hover:text-white disabled:bg-neutral-900 disabled:text-white`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon style={{ color }} />
      <span className="hidden md:block">{label}</span>
    </Button>
  );
};

export default AnnotatonBtn;
