import React from 'react';
import Header from '../../components/Header';
import ImageGallery from '../../components/ImageGallery';

const Testpage = () => {
    const imageUrls = [
        'https://picsum.photos/id/1018/800/500',
        'https://picsum.photos/id/1015/800/500',
        'https://picsum.photos/id/1019/800/500',
        'https://picsum.photos/id/1021/800/500',
        // 添加更多圖片 URL
    ];
    return(
        <>
            <Header />
                <div className="gallery-container">
                    <ImageGallery images={imageUrls} autoScrollInterval={1000}/>
                </div>
        </>
    )
}

export default Testpage;