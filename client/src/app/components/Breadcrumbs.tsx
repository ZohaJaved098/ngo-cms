"use client";

import Link from "next/link";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";

type Page = {
  _id: string;
  title: string;
  slug: string;
  parent?: string | null;
};

async function fetchPageById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAGES_API_URL}/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.page as Page;
}

async function buildBreadcrumbs(page: Page) {
  const crumbs: { label: string; href: string | null }[] = [
    { label: "Home", href: "/" },
  ];

  let current: Page | null = null;

  if (page.parent) {
    current = await fetchPageById(page.parent);
  }

  const parentCrumbs: { label: string; href: string }[] = [];

  // parent chain traverse
  while (current) {
    parentCrumbs.unshift({
      label: current.title,
      href: `${current.slug}`,
    });

    if (current.parent) {
      current = await fetchPageById(current.parent);
    } else {
      current = null;
    }
  }

  crumbs.push(...parentCrumbs);

  // current page
  crumbs.push({ label: page.title, href: null });

  return crumbs;
}

export function Breadcrumbs({ page }: { page: Page }) {
  const [crumbs, setCrumbs] = useState<
    { label: string; href: string | null }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const built = await buildBreadcrumbs(page);
      if (built) setCrumbs(built);
    };
    load();
  }, [page]);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center  gap-2">
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex justify-center items-center  gap-2">
            {crumb.href ? (
              <Link
                href={idx === 0 ? `/` : `/slug/${crumb.href}`}
                className="hover:underline hover:text-blue-600 flex items-center gap-1"
              >
                {idx === 0 && <FaHome className="inline" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800">{crumb.label}</span>
            )}
            {idx < crumbs.length - 1 && (
              <span>
                <FaChevronRight className="inline w-3 h-3" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
