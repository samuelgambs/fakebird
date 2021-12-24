import moment from "moment";
import "./Post.css";

const Post = ({ uuid, content, created }) => {
  return (
    <div className="Post" id={uuid}>
      <p className="Post-content">{content}</p>
      <div className="Post-info">
        <small className="Post-date">{moment.utc(created).fromNow()}</small>
      </div>
    </div>
  );
};

export default Post;
