import ToInitBtn from "./ToInitBtn";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ToInitBtn />
      {children}
    </div>
  );
}
