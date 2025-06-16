const dummy = (blogs) => {
    return 1
}

const likes_counter = (blogs) => {
    if (blogs.length ===0){
        return 0
    }
    else if (blogs.length ===1){
        return blogs[0].likes
    }
    else {
        let total = 0
        for (let i =0; i < blogs.length; i++){
            total += blogs[i].likes
        }
        return total
    }
}

const favouriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let maxLikes = blogs[0].likes
    let favourite = blogs[0]
    for (let i = 1; i < blogs.length; i++){
         if (blogs[i].likes > maxLikes){
            maxLikes = blogs[i].likes
            favourite = blogs[i]
         }
    }
    return favourite.title
}
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorCount = {}
    for (const blog of blogs){
        if(authorCount[blog.author]){
            authorCount[blog.author]+=1
        }
        else{
            authorCount[blog.author]=1
        }}
        let maxBlogs=0
        let maxAuthor = ''
        for (const author in authorCount) {
            if (authorCount[author] > maxBlogs) {
                maxBlogs = authorCount[author]
                maxAuthor = author
            }
        }
        return {author:maxAuthor, blogs:maxBlogs}
    }
const mostLikedAuthor = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const authorLikes = {}
    for (const blog of blogs) {
        if (authorLikes[blog.author]) {
            authorLikes[blog.author] += blog.likes
        }
        else {
            authorLikes[blog.author] = blog.likes
        }
    }
    let maxLikes = 0
    let maxAuthor = ''
    for (const author in authorLikes) {
        if (authorLikes[author] > maxLikes) {
            maxLikes = authorLikes[author]
            maxAuthor = author
        }
    }
    return ({author: maxAuthor, likes: maxLikes})
}

module.exports = {dummy,likes_counter,favouriteBlog,mostBlogs,mostLikedAuthor}