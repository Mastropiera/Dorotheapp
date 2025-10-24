export interface Patient {
    id: string;
    name: string;
    identifier?: string;
    address?: string;
    phone?: string;
    createdAt: string;
  }
  
  export interface PatientNote {
    id: string;
    patientId: string;
    content: string;
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: number;
      respiratoryRate?: number;
      temperature?: number;
      saturation?: number;
      painScale?: string;
      glycemia?: number;
    };
    createdAt: string;
    updatedAt: string;
  }
  