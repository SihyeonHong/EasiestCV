export default function Title({ title }: { title?: string }) {
  return (
    <h1 className="mx-auto my-14 cursor-default text-center text-4xl font-bold">
      {title ? title.toUpperCase() : "Easiest CV"}
    </h1>
  );
}
