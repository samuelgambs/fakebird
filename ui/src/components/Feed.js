import { useContext } from "react";
import { PostContext } from "../context/PostContext";
import Post from "./Post";
import "./Feed.css";

const Feed = () => {
  const { posts, deletePost, loadMore, has_next, next_num  } = useContext(PostContext);

  return (
    <div key={`feed${posts.length}`} className="Feed">
      {!posts || posts.length === 0 ? (
        <p className="Feed-empty">No posts in your feed yet...</p>
      ) : (
        posts.map((post) => (
          <>
            <Post key={post.uuid} {...post} />
            <button
            key={`button${post.uuid}`}
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this item?")
                )
                  deletePost(post);
              }}
            >
              Delete
            </button>
          </>
        ))
      )}
      <button disabled={!has_next} onClick={() => loadMore(next_num)}>
        Load More 
      </button>
    </div>
  );
};



export default Feed;
