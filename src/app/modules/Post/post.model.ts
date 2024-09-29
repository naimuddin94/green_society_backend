import { Schema, model } from 'mongoose';
import { IPost } from './post.interface';

// Define the post schema
const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    like: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: false,
    },
    dislike: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: false,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  }
);

postSchema.virtual('upvotes').get(function () {
  const likeCount = this.like ? this.like.length : 0;
  const dislikeCount = this.dislike ? this.dislike.length : 0;
  return likeCount - dislikeCount;
});

// Static method to find all posts by a specific author
postSchema.statics.findPostsByAuthor = async function (authorId: string) {
  return await this.find({ author: authorId });
};

// Creating the Post model
const Post = model<IPost>('Post', postSchema);

export default Post;
