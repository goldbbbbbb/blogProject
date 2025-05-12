export interface post {
    _id: string;
    topicName: string;
    content: string;
    category: string;
    numOfLike: number;
    numOfBookmark: number,
    likedBy: string[];
    author: string;
}