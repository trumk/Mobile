export type ClassType = {
    _id: string;
    typeName: string;
};

export type YogaCourse = {
    _id: string; 
    dayOfWeek: string; 
    courseTime: string; 
    capacity: number; 
    duration: number; 
    pricePerClass: number; 
    classType: ClassType; 
    description?: string; 
    teacherName: string;
    location: string; 
};
