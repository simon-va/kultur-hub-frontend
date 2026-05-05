export interface Report {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  organizationId: string;
  organizationName: string;
  eventId?: string;
  eventTitle?: string;
  imageUrl?: string;
  isPublished: boolean;
}
