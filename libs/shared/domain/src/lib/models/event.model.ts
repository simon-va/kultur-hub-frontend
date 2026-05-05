export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  organizationId: string;
  organizationName: string;
  imageUrl?: string;
  isPublished: boolean;
}
