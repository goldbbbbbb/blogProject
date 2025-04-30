export interface post {
    _id: string;
    topicName: string;
    content: string;
    category: string;
    numOfLike: number;
    likedBy: string[];
    author: string;
}