import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-west-2",
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "local",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "local",
    },
  }),
});

export const docClient = DynamoDBDocumentClient.from(client);

// Table names
const TABLES = {
  CONTENT: process.env.DYNAMODB_CONTENT_TABLE || "wrs-content",
  ARTICLES: process.env.DYNAMODB_ARTICLES_TABLE || "wrs-articles",
  EVENTS: process.env.DYNAMODB_EVENTS_TABLE || "wrs-events",
  GALLERY: process.env.DYNAMODB_GALLERY_TABLE || "wrs-gallery",
  SUBSCRIBERS: process.env.DYNAMODB_SUBSCRIBERS_TABLE || "wrs-subscribers",
};

// Type definitions
export interface PageContent {
  pageId: string;
  title: string;
  content: Record<string, unknown>;
  lastModified: string;
  modifiedBy: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  status: "draft" | "published";
  featuredImage?: string;
  category: string;
  readTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "meeting" | "special" | "workshop";
  featured?: boolean;
  image?: string;
  registrationUrl?: string;
}

export interface GalleryImage {
  id: string;
  category: string;
  title: string;
  description: string;
  s3Key: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
  source: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  active: boolean;
  order: number;
}

export interface SiteSettings {
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  nextMeetingDate: string;
  contactEmail: string;
  clubUrl: string;
  youtubeVideoId: string;
}

// Page Content Operations
export const pageContent = {
  async get(pageId: string): Promise<PageContent | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: `PAGE#${pageId}`,
          SK: "CONTENT",
        },
      })
    );
    return response.Item as PageContent | null;
  },

  async update(pageId: string, data: Partial<PageContent>): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: `PAGE#${pageId}`,
          SK: "CONTENT",
          ...data,
          lastModified: new Date().toISOString(),
        },
      })
    );
  },
};

// Article Operations
export const articles = {
  async list(status?: "draft" | "published"): Promise<Article[]> {
    const params: ScanCommandInput = {
      TableName: TABLES.ARTICLES,
    };

    if (status) {
      params.FilterExpression = "#status = :status";
      params.ExpressionAttributeNames = { "#status": "status" };
      params.ExpressionAttributeValues = { ":status": status };
    }

    const response = await docClient.send(new ScanCommand(params));
    return (response.Items || []) as Article[];
  },

  async get(id: string): Promise<Article | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.ARTICLES,
        Key: {
          PK: `ARTICLE#${id}`,
          SK: "META",
        },
      })
    );
    return response.Item as Article | null;
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLES.ARTICLES,
        FilterExpression: "slug = :slug",
        ExpressionAttributeValues: { ":slug": slug },
      })
    );
    return (response.Items?.[0] as Article) || null;
  },

  async create(data: Omit<Article, "id">): Promise<Article> {
    const id = uuidv4();
    const article: Article = {
      ...data,
      id,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.ARTICLES,
        Item: {
          PK: `ARTICLE#${id}`,
          SK: "META",
          ...article,
        },
      })
    );

    return article;
  },

  async update(id: string, data: Partial<Article>): Promise<void> {
    const existing = await this.get(id);
    if (!existing) throw new Error("Article not found");

    await docClient.send(
      new PutCommand({
        TableName: TABLES.ARTICLES,
        Item: {
          PK: `ARTICLE#${id}`,
          SK: "META",
          ...existing,
          ...data,
        },
      })
    );
  },

  async delete(id: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.ARTICLES,
        Key: {
          PK: `ARTICLE#${id}`,
          SK: "META",
        },
      })
    );
  },
};

// Event Operations
export const events = {
  async list(): Promise<Event[]> {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLES.EVENTS,
      })
    );
    return (response.Items || []) as Event[];
  },

  async get(id: string): Promise<Event | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.EVENTS,
        Key: {
          PK: `EVENT#${id}`,
          SK: "META",
        },
      })
    );
    return response.Item as Event | null;
  },

  async create(data: Omit<Event, "id">): Promise<Event> {
    const id = uuidv4();
    const event: Event = {
      ...data,
      id,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.EVENTS,
        Item: {
          PK: `EVENT#${id}`,
          SK: "META",
          ...event,
        },
      })
    );

    return event;
  },

  async update(id: string, data: Partial<Event>): Promise<void> {
    const existing = await this.get(id);
    if (!existing) throw new Error("Event not found");

    await docClient.send(
      new PutCommand({
        TableName: TABLES.EVENTS,
        Item: {
          PK: `EVENT#${id}`,
          SK: "META",
          ...existing,
          ...data,
        },
      })
    );
  },

  async delete(id: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.EVENTS,
        Key: {
          PK: `EVENT#${id}`,
          SK: "META",
        },
      })
    );
  },
};

// Gallery Operations
export const gallery = {
  async list(category?: string): Promise<GalleryImage[]> {
    const params: ScanCommandInput = {
      TableName: TABLES.GALLERY,
    };

    if (category) {
      params.FilterExpression = "category = :category";
      params.ExpressionAttributeValues = { ":category": category };
    }

    const response = await docClient.send(new ScanCommand(params));
    return (response.Items || []) as GalleryImage[];
  },

  async create(data: Omit<GalleryImage, "id">): Promise<GalleryImage> {
    const id = uuidv4();
    const image: GalleryImage = {
      ...data,
      id,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.GALLERY,
        Item: {
          PK: `GALLERY#${data.category}`,
          SK: `IMAGE#${id}`,
          ...image,
        },
      })
    );

    return image;
  },

  async delete(category: string, id: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.GALLERY,
        Key: {
          PK: `GALLERY#${category}`,
          SK: `IMAGE#${id}`,
        },
      })
    );
  },
};

// Subscriber Operations
export const subscribers = {
  async list(): Promise<Subscriber[]> {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLES.SUBSCRIBERS,
      })
    );
    return (response.Items || []) as Subscriber[];
  },

  async subscribe(email: string, source: string = "website"): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLES.SUBSCRIBERS,
        Item: {
          PK: `SUBSCRIBER#${email.toLowerCase()}`,
          SK: "META",
          email: email.toLowerCase(),
          subscribedAt: new Date().toISOString(),
          status: "active",
          source,
        },
      })
    );
  },

  async unsubscribe(email: string): Promise<void> {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLES.SUBSCRIBERS,
        Key: {
          PK: `SUBSCRIBER#${email.toLowerCase()}`,
          SK: "META",
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "unsubscribed" },
      })
    );
  },
};

// Team Member Operations
export const teamMembers = {
  async list(activeOnly: boolean = false): Promise<TeamMember[]> {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLES.CONTENT,
        FilterExpression: activeOnly
          ? "begins_with(PK, :pk) AND active = :active"
          : "begins_with(PK, :pk)",
        ExpressionAttributeValues: activeOnly
          ? { ":pk": "TEAM#", ":active": true }
          : { ":pk": "TEAM#" },
      })
    );
    const items = (response.Items || []) as TeamMember[];
    return items.sort((a, b) => a.order - b.order);
  },

  async get(id: string): Promise<TeamMember | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: `TEAM#${id}`,
          SK: "META",
        },
      })
    );
    return response.Item as TeamMember | null;
  },

  async create(data: Omit<TeamMember, "id">): Promise<TeamMember> {
    const id = uuidv4();
    const member: TeamMember = {
      ...data,
      id,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: `TEAM#${id}`,
          SK: "META",
          ...member,
        },
      })
    );

    return member;
  },

  async update(id: string, data: Partial<TeamMember>): Promise<void> {
    const existing = await this.get(id);
    if (!existing) throw new Error("Team member not found");

    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: `TEAM#${id}`,
          SK: "META",
          ...existing,
          ...data,
        },
      })
    );
  },

  async delete(id: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: `TEAM#${id}`,
          SK: "META",
        },
      })
    );
  },

  async reorder(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.update(orderedIds[i], { order: i });
    }
  },
};

// Testimonial Operations
export const testimonials = {
  async list(activeOnly: boolean = false): Promise<Testimonial[]> {
    const response = await docClient.send(
      new ScanCommand({
        TableName: TABLES.CONTENT,
        FilterExpression: activeOnly
          ? "begins_with(PK, :pk) AND active = :active"
          : "begins_with(PK, :pk)",
        ExpressionAttributeValues: activeOnly
          ? { ":pk": "TESTIMONIAL#", ":active": true }
          : { ":pk": "TESTIMONIAL#" },
      })
    );
    const items = (response.Items || []) as Testimonial[];
    return items.sort((a, b) => a.order - b.order);
  },

  async get(id: string): Promise<Testimonial | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: `TESTIMONIAL#${id}`,
          SK: "META",
        },
      })
    );
    return response.Item as Testimonial | null;
  },

  async create(data: Omit<Testimonial, "id">): Promise<Testimonial> {
    const id = uuidv4();
    const testimonial: Testimonial = {
      ...data,
      id,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: `TESTIMONIAL#${id}`,
          SK: "META",
          ...testimonial,
        },
      })
    );

    return testimonial;
  },

  async update(id: string, data: Partial<Testimonial>): Promise<void> {
    const existing = await this.get(id);
    if (!existing) throw new Error("Testimonial not found");

    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: `TESTIMONIAL#${id}`,
          SK: "META",
          ...existing,
          ...data,
        },
      })
    );
  },

  async delete(id: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: `TESTIMONIAL#${id}`,
          SK: "META",
        },
      })
    );
  },

  async reorder(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.update(orderedIds[i], { order: i });
    }
  },
};

// Site Settings Operations
export const siteSettings = {
  async get(): Promise<SiteSettings | null> {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLES.CONTENT,
        Key: {
          PK: "SETTINGS",
          SK: "SITE",
        },
      })
    );
    return response.Item as SiteSettings | null;
  },

  async update(data: Partial<SiteSettings>): Promise<void> {
    const existing = await this.get();
    const defaults: SiteSettings = {
      meetingDay: "2nd and 4th Wednesday",
      meetingTime: "6:45pm for 7:00pm start",
      meetingLocation: "Leonardo Hotel, Leeds",
      nextMeetingDate: "",
      contactEmail: "whiterosespeaker@gmail.com",
      clubUrl: "https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20",
      youtubeVideoId: "Nt6iyS-WBPs",
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
          PK: "SETTINGS",
          SK: "SITE",
          ...(existing || defaults),
          ...data,
        },
      })
    );
  },
};
