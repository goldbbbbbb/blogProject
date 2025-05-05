import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import { post } from '../../types/Post';
import PostList from '../../components/Postlist';

const Searchtopic = () => {
    const {searchKeyword} = useParams<{ searchKeyword: string }>();
    const [searchResult, setSearchResult] = useState<post[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const moveToContent = (id: string) => {
        navigate(`/content/${id}`);
    }

    useEffect(() => {
        const fetchSearchTopic = async () => {
            if (searchKeyword && searchKeyword.trim()) {
                try {
                    const response = await fetch (`http://localhost:3000/api/searchTopic?q=${encodeURIComponent(searchKeyword)}`, {
                        method: 'get',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setSearchResult(data.searchResult);
                    } else if (data.invalidToken) {
                        alert(data.message);
                        localStorage.clear();
                        navigate('/');
                    }
                } catch (errorMsg) {
                    console.log(`取得搜尋結果時發生錯誤，${errorMsg}`);
                }                
            } else {
                alert('搜尋欄需有關鍵詞');
                navigate('/homepage');
            }
        }
        fetchSearchTopic();
    }, [searchKeyword])

    return (
        <>
            <Header />
            { searchResult.length > 0 ?
                    <PostList posts={searchResult} moveToContent={moveToContent}/>
                :
                    <div>搜尋不到結果</div>
            }
        </>
    )
}

export default Searchtopic;

