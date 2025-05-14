export type userData =
    {
        idNumber: string;
        firstName: string;
        lastName: string;
        dob: string;
        age: number;
        bloodType: string;
        email: string;
        password: string;
        emergencyContact?: {
            contactName: string;
            relationship: string;
            contactPhone: string;
            contactEmail: string;
        };
    }
