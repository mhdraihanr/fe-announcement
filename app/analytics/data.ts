import { initialAnnouncements } from "@/app/announcements/data";
import { initialDocuments } from "@/app/documents/data";

interface ViewAnalytics {
  id: number;
  title: string;
  type: "announcement" | "document";
  reads: number;
  totalUsers: number;
  downloads?: number;
  department: string;
  createdDate: string;
  viewers: Array<{
    name: string;
    avatar: string;
    viewedAt: string;
    department: string;
    role: string;
  }>;
}

// Function to generate analytics data from announcements and documents
function generateAnalyticsData(): ViewAnalytics[] {
  const analyticsData: ViewAnalytics[] = [];

  // Convert announcements to analytics data
  initialAnnouncements.forEach((announcement) => {
    analyticsData.push({
      id: announcement.id,
      title: announcement.title,
      type: "announcement",
      reads: announcement.views,
      totalUsers: announcement.views + Math.floor(Math.random() * 50) + 20, // Simulate total users
      department: announcement.department,
      createdDate: announcement.date,
      viewers: announcement.viewers.map((viewer) => ({
        name: viewer.name,
        avatar: viewer.avatar,
        viewedAt: viewer.readAt,
        department: viewer.department,
        role: viewer.role,
      })),
    });
  });

  // Convert documents to analytics data
  initialDocuments.forEach((document) => {
    analyticsData.push({
      id: document.id + 100, // Offset to avoid ID conflicts
      title: document.name,
      type: "document",
      reads: document.views,
      totalUsers: document.views + Math.floor(Math.random() * 30) + 10, // Simulate total users
      downloads: document.downloads,
      department: document.department,
      createdDate: document.uploadDate,
      viewers: [
        // Generate some sample viewers for documents
        {
          name: document.uploadedBy,
          avatar: "/api/placeholder/32/32",
          viewedAt: document.uploadDate + " 09:00",
          department: document.department,
          role: "Employee",
        },
        {
          name: "System Admin",
          avatar: "/api/placeholder/32/32",
          viewedAt: document.uploadDate + " 10:30",
          department: "IT",
          role: "Admin",
        },
      ],
    });
  });

  return analyticsData.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

export const initialAnalyticsData: ViewAnalytics[] = generateAnalyticsData();

export type { ViewAnalytics };
