import { useMemo, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import PostCard from "@/components/PostCard";
import { allPosts, visitedProvinces } from "@/lib/posts";

const Index = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const postCounts = useMemo(() => {
    const m: Record<string, number> = {};
    allPosts.forEach((p) => (m[p.province] = (m[p.province] ?? 0) + 1));
    return m;
  }, []);

  const visiblePosts = filter ? allPosts.filter((p) => p.province === filter) : allPosts;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative border-b border-ink/20">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container max-w-6xl py-10 md:py-14 relative">
          <div className="flex items-baseline gap-4">
            <span className="font-hand text-5xl md:text-6xl text-primary leading-none">足迹日志</span>
            <span className="font-type text-xs md:text-sm text-ink-faded tracking-widest uppercase">
              FIELD NOTES · VOL.01
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-ink-faded leading-relaxed">
            一本写在牛皮纸上的旅行日记。地图里点亮的，是脚步抵达过的远方；
            每一篇文章，是一卷未冲洗完的胶片。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="stamp">已抵达 {visitedProvinces.length} 省</span>
            <span className="stamp" style={{ transform: "rotate(4deg)" }}>{allPosts.length} 篇手记</span>
          </div>
        </div>
      </header>

      {/* Map */}
      <section className="container max-w-6xl py-10 md:py-14">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">
            <span className="font-hand text-primary mr-2">「</span>
            走过的山河
            <span className="font-hand text-primary ml-2">」</span>
          </h2>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="font-type text-xs text-primary hover:underline"
            >
              × 清除筛选 ({filter})
            </button>
          )}
        </div>
        <div className="paper-card grain rounded-sm p-3 md:p-6">
          <ChinaMap
            visited={visitedProvinces}
            postCounts={postCounts}
            onSelect={(p) => setFilter((cur) => (cur === p ? null : p))}
          />
          <p className="mt-3 text-center font-type text-xs text-ink-faded">
            点击高亮省份可筛选下方文章 · 颜色越深，足迹越多
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="container max-w-6xl pb-20">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">
            <span className="font-hand text-primary mr-2">「</span>
            旅行手记
            <span className="font-hand text-primary ml-2">」</span>
          </h2>
          <span className="font-type text-xs text-ink-faded">
            {visiblePosts.length} / {allPosts.length}
          </span>
        </div>
        <div className="grid gap-8 md:gap-10 md:grid-cols-2">
          {visiblePosts.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>

      <footer className="border-t border-ink/20 py-8 text-center font-type text-xs text-ink-faded">
        © {new Date().getFullYear()} 足迹日志 · 用 Lovable 写在静态页面上
      </footer>
    </div>
  );
};

export default Index;
