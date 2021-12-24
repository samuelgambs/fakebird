import { createContext, useState, useCallback, useEffect } from "react";

import useMounted from "../hooks/useMounted";

const PostContext = createContext({ posts: [], 
  refresh() {},
  create() {},
  deletePost() {},
  loadMore() {},
  has_next: Boolean,
  next_num: Number,
});
PostContext.displayName = "PostContext";

const PostContextProvider = ({ children }) => {
  const isMounted = useMounted();
  const [posts, setPosts] = useState([]);
  const [has_next, setHasNext] = useState();
  const [next_num, setNextNum] = useState();

  const refresh = useCallback(() => {
    fetch("/api/posts/")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted()) {
          setPosts(data.posts);
          setHasNext(data.has_next);
          setNextNum(data.next_num);
        }
      });
  }, [isMounted]); 

  const create = useCallback(
    async (content) => {
      return fetch("/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }).then(() => isMounted() && refresh());
    },
    [refresh, isMounted]
  );

  const deletePost = useCallback(
    async (post) => {
      return fetch(`/api/posts/${post.uuid}`, {
        method: "DELETE",
      }).then(() => isMounted() && refresh());
    },
    [refresh, isMounted]  // eslint-disable-line react-hooks/exhaustive-deps  
  );

  const loadMore = useCallback(
    async (page) => fetch(`/api/posts/?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted()) {
          setPosts(posts.concat(data.posts));
          setHasNext(data.has_next);
          setNextNum(data.next_num);
        }
      }),
    [isMounted, posts]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PostContext.Provider
      value={{
        posts,
        refresh,
        create,
        deletePost,
        loadMore,
        has_next,
        next_num,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostContextProvider };