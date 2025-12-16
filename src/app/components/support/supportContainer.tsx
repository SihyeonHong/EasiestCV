interface SupportContainerProps {
  children: React.ReactNode;
}

export default function SupportContainer({ children }: SupportContainerProps) {
  return (
    <div className="grid w-full max-w-body grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-6 md:gap-8">
      {children}
    </div>
  );
}
