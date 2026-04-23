import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/lib/posts";

const PostDetail = () => {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-hand text-3xl text-primary">这页似乎被风吹走了</p>
        <Link to="/" className="font-type text-sm underline">← 回到日志</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen">
      {post.cover && (
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden border-b border-ink/20">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover sepia-[.3] contrast-105" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container max-w-3xl pb-8">
              <span className="stamp">{post.province}</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold text-paper drop-shadow-lg">{post.title}</h1>
              <p className="mt-2 font-type text-sm text-paper/80">
                {post.date} · {post.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-3xl py-12">
        <Link to="/" className="font-type text-xs text-primary hover:underline">← 返回足迹</Link>

        <div className="mt-6 paper-card grain p-6 md:p-12 rounded-sm">
          <div className="prose-journal">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-10 text-center font-hand text-3xl text-primary">— 完 —</div>
      </div>
    </article>
  );
};

export default PostDetail;
