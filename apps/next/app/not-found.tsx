import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-center h-screen">
      <div className="flex flex-col gap-2">
        <h1>Page not found</h1>
        <Link animate-hover="underline" href="/">
          Back to website
        </Link>
      </div>
    </div>
  );
}
