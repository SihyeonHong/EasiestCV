import Button from "@/app/components/common/Button";

export default function Header() {
  return (
    <div className="flex w-full justify-end">
      <Button variant="link" href="/">
        Log In | Sign Up
      </Button>
    </div>
  );
}
