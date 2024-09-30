// types.ts
export type Hike = {
    _id: string; // Bắt buộc cho chỉnh sửa
    name: string;
    location: string;
    locationEnd: string;
    date: string;
    parkingAvailable: string;
    length: number;
    difficulty: string;
    description?: string;
    weather?: string;
};