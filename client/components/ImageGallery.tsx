import React, { useRef, useState, useEffect } from 'react';
import './ImageGallery.css'; // 假設您將 CSS 放在這個文件中

interface ImageGalleryProps {
  images: string[]; // 圖片 URL 陣列
  autoScrollInterval?: number; // 自動滾動間隔，單位毫秒 (可選，默認不自動滾動)
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, autoScrollInterval }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 監聽滾動事件，更新 activeIndex
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const scrollLeft = scroller.scrollLeft;
      const itemWidth = scroller.clientWidth; // 滾動容器的寬度，即每張圖片的寬度

      // 計算當前最接近的圖片索引
      const currentIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(currentIndex);
    };

    scroller.addEventListener('scroll', handleScroll);

    // 清理事件監聽器
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [images]); // 當圖片列表改變時重新設置監聽器

  // 添加自動滾動邏輯
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoScrollInterval && images.length > 1) {
      intervalId = setInterval(() => {
        const scroller = scrollerRef.current;
        if (scroller) {
          const itemWidth = scroller.clientWidth;
          const nextIndex = (activeIndex + 1) % images.length; // 計算下一個圖片的索引，循環

          const scrollToPosition = nextIndex * itemWidth;

          scroller.scrollTo({
            left: scrollToPosition,
            behavior: 'smooth', // 平滑滾動
          });

          // 注意：setActiveIndex 會在 scroll 事件處理函數中被更新，所以這裡不需要手動調用
          // setActiveIndex(nextIndex); // 這裡不需要，因為 scroll 事件會觸發 handleScroll
        }
      }, autoScrollInterval);
    }

    // 清理定時器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeIndex, images.length, autoScrollInterval]); // 依賴 activeIndex, images.length, autoScrollInterval

  // 處理圓點點擊事件
  const handleDotClick = (index: number) => {
    const scroller = scrollerRef.current;
    if (scroller) {
      const itemWidth = scroller.clientWidth;
      const scrollToPosition = index * itemWidth;

      scroller.scrollTo({
        left: scrollToPosition,
        behavior: 'smooth', // 平滑滾動
      });
    }
  };

  return (
    <div className="gallery-container">
      <div className="image-scroller" ref={scrollerRef}>
        {images.map((imageUrl, index) => (
          <div className="image-item" key={index}>
            <img src={imageUrl} alt={`圖片 ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="navigation-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;