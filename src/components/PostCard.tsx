import { Link } from "react-router-dom";
import { Post } from "@/lib/posts";

const PostCard = ({ post, index }: { post: Post; index: number }) => {
  // Slight rotation alternation for "scrapbook" feel
  const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];
  const tilt = tilts[index % tilts.length];
  return (
    <Link
      to={`/posts/${post.slug}`}
      className={`group block paper-card grain rounded-sm transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 ${tilt}`}
    >
      {post.cover && (
        <div className="relative overflow-hidden border-b border-ink/20">
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            className="w-full h-52 object-cover sepia-[.25] contrast-[1.05] group-hover:sepia-0 transition-all duration-700"
          />
          <span className="absolute top-3 right-3 stamp">{post.province}</span>
        </div>
      )}
      <div className="relative p-5 md:p-6">
        <div className="flex items-center gap-3 text-xs font-type text-ink-faded mb-2">
          <span>{post.date}</span>
          {post.location && <span>· {post.location}</span>}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-ink leading-snug mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-ink-faded leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 font-hand text-2xl text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          翻开 →
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
