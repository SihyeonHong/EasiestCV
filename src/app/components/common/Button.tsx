import Link from "next/link";
import { cn } from "@/util/classname";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  role?: "default" | "link";
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const baseButtonStyles = "m-3 rounded-md px-3 py-2 text-sm no-underline";

const buttonVariants = {
  primary:
    "[&]:bg-black hover:bg-gray-800 text-white shadow-sm hover:shadow-md",
  secondary:
    "[&]:bg-white hover:bg-gray-100 text-black border border-gray-300 hover:shadow-sm",
};

export default function Button({
  children,
  className,
  variant = "primary",
  role = "default",
  href,
  ...props
}: ButtonProps) {
  const combinedClassName = cn(
    baseButtonStyles,
    buttonVariants[variant],
    className,
  );

  if (role === "link" && href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
