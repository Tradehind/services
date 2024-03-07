const { BlogModel } = require('../../models');
const Blog = BlogModel;

exports.getAllPosts = async (req, res) => {
    try {
        const { page = 1, pageSize = 100 } = req.query;
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        const posts = await Blog.find()
                                 .skip(offset)
                                 .limit(limit)
                                 .exec();

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWebBlogs = async (req, res) => {
    try {
        const randomBlogs = await Blog.find({ is_active: true })
                                      .sort({ createdAt: 'desc' })
                                      .limit(4)
                                      .exec();

        res.json({ msg: 'blogs fetched', data: randomBlogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        req.body.is_active = true;
        const newPost = await Blog.create(req.body);
        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const updatedPost = await Blog.findByIdAndUpdate(postId, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ status: 200, msg: "Blog updated successfully", data: updatedPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const deletedPost = await Blog.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(deletedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markBlogStatus = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'blog not found' });
        }

        // Toggle the 'active' status
        blog.is_active = !blog.is_active;
        const updatedblog = await blog.save();

        res.json(updatedblog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
