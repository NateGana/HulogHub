"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Wallet2, ChevronRight } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { Modal } from "@/components/ui/Modal";
import { truncateAddress } from "@/lib/utils";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/groups": "My Groups",
  "/contributions": "Contributions",
  "/payouts": "Payouts",
  "/transactions": "Transactions",
  "/wallet": "Wallet",
  "/members": "Members",
  "/notifications": "Notifications",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, unreadNotificationCount } = useAppData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const title = useMemo(() => {
    const base = "/" + (pathname?.split("/")[1] ?? "");
    return PAGE_TITLES[base] ?? "HulogHub";
  }, [pathname]);

  const results = useMemo(() => {
    if (!data || query.trim().length < 1) return null;
    const q = query.toLowerCase();
    return {
      groups: data.groups.filter((g) => g.name.toLowerCase().includes(q)).slice(0, 4),
      members: data.members.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 4),
      transactions: data.transactions.filter((t) => t.description.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [data, query]);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 lg:pl-6">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            HulogHub <ChevronRight className="h-3 w-3" />
          </p>
          <h1 className="font-display text-lg font-bold text-foreground sm:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="w-36 text-left text-xs">Search...</span>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
            )}
          </Link>

          <Link
            href="/wallet"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted sm:flex"
          >
            <Wallet2 className="h-3.5 w-3.5 text-primary-600" />
            {data?.wallet.connected ? truncateAddress(data.wallet.address ?? "") : "Not connected"}
          </Link>

          {data && (
            <MemberAvatar
              name={data.currentUser.name}
              initials={data.currentUser.initials}
              color={data.currentUser.avatarColor}
              size="sm"
            />
          )}
        </div>
      </header>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} maxWidth="max-w-xl">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groups, members, transactions..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-3 max-h-80 space-y-4 overflow-y-auto">
          {!results && <p className="py-8 text-center text-sm text-muted-foreground">Start typing to search HulogHub.</p>}
          {results && (
            <>
              {results.groups.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase text-muted-foreground">Groups</p>
                  {results.groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/groups/${g.id}`);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
              {results.members.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase text-muted-foreground">Members</p>
                  {results.members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/members`);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
              {results.transactions.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase text-muted-foreground">Transactions</p>
                  {results.transactions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/transactions`);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {t.description}
                    </button>
                  ))}
                </div>
              )}
              {results.groups.length === 0 && results.members.length === 0 && results.transactions.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No results for "{query}".</p>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
