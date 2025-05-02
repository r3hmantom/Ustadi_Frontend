import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-xl">
            Ustadi
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth?signup=true">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
