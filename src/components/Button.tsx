import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-moss-800 text-paper hover:bg-moss-700 shadow-soft hover:shadow-lift",
  secondary:
    "bg-transparent text-moss-800 border-2 border-moss-800 hover:bg-moss-50",
  ghost: "bg-moss-50 text-moss-800 hover:bg-moss-100",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function classes({ variant = "primary", size = "md", className = "" }: BaseProps) {
  return `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-700 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
}

export const Button = forwardRef<
  HTMLButtonElement,
  BaseProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant, size, className, ...props }, ref) => (
  <button ref={ref} className={classes({ variant, size, className })} {...props} />
));
Button.displayName = "Button";

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: BaseProps & { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={classes({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}
