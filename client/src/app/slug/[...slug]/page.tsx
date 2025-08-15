import Contents from "@/app/components/Contents";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

async function getPageData(slugPath: string) {
  const encodedSlug = encodeURIComponent(slugPath);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAGES_API_URL}/slug/${encodedSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.page;
}

export default async function Pages(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const slugPath = "/" + slug.join("/");

  const page = await getPageData(slugPath);

  if (!page) {
    return (
      <div className="w-4/5 mx-auto mt-40 py-20 text-center flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Page Not Found!</h1>
        <Link
          className="flex items-center justify-center gap-3 cursor-pointer text-sm text-gray-500 font-medium hover:underline hover:text-blue-500"
          href="/"
        >
          <p>Return Home</p>
          <FaHome className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto mt-40 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      <Contents content={page.content} />
    </div>
  );
}
