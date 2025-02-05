import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "link";
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const defaultButtonStyles =
  "m-3 rounded-md px-3 py-2 text-sm text-white no-underline shadow-md hover:shadow-lg [&]:bg-black [&]:hover:bg-gray-900";

export default function Button({
  children,
  className,
  variant = "default",
  href,
  ...props
}: ButtonProps) {
  if (variant === "link" && href) {
    return (
      <Link href={href} className={`${defaultButtonStyles} ${className || ""}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${defaultButtonStyles} ${className || ""}`} {...props}>
      {children}
    </button>
  );
}
