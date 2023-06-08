import {useEffect, useState} from "react";

export interface Post {
    body:string,
    id:number,
    title:string,
    userId:number,
}

export const App = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/posts');
                const data = await res.json();
                setPosts(data)
                localStorage.setItem('posts', JSON.stringify(data))
            } catch (e) {
                console.log('Błąd podczas pobierania danych', e)
            }
        })()
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
        setLoading(false)

    }, []);
    useEffect(() => {
        const sortedPosts = posts?.sort((a, b) => a.title.localeCompare(b.title));
        setFilteredPosts(sortedPosts);
    }, [posts]);

    console.log(posts);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    if(loading){
        return <h2>Loading...</h2>
    }
    return (
        <div>
            {currentPosts.map((post: Post) => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}


            <div>
                {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                    <button style={index + 1 === currentPage ? {border:"2px solid white"} : {border:"none"}} key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}