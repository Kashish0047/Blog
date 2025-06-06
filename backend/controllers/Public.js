import PostModel from "../models/Blog.model.js"

const GetSinglePost = async(req,res) => {
    try {
        const postId = req.params.id
        const FindPost = await PostModel.findById(postId)
        .populate({
            path: 'comment',
            populate: {
               path : "userId"
            }    
        })

        if(!FindPost){
            return res.status(404).json({
                message: "Post not found",
                status: false
            })
        }

        res.status(200).json({
            success: true,
            Post: FindPost
        })


    } catch (error) {
         return res.status(500).json({
                message: "Internal server error",
                status: false
            })
    }
}

export {GetSinglePost}