export default function Title({ title }: { title?: string }) {
  return (
    <h1 className="mx-auto my-8 cursor-default text-center text-4xl font-bold sm:my-14">
      {title ? title.toUpperCase() : "Easiest CV"}
    </h1>
  );
}
