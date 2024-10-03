export type YogaCourse = {
    _id: string; 
    dayOfWeek: string; 
    courseTime: string; 
    capacity: number; 
    duration: number; 
    pricePerClass: number; 
    classType: string; 
    description?: string; 
    teacherName: string;
    location: string; 
};
