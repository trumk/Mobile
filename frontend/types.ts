export type ClassType = {
    _id: string;
    typeName: string;
    description?: string;
    teacher?: string;
    date?: string;
    duration?: number;
  };
  
  export type YogaCourse = {
    _id: string;
    dayOfWeek: string;
    courseTime: string;
    capacity: number;
    duration: number;
    pricePerClass: number;
    classType: ClassType[]; 
    description?: string;
    teacherName: string;
    location: string;
    isJoined?: boolean; 
  };
  