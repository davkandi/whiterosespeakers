/**
 * Setup script for local DynamoDB development
 * Run with: npx tsx scripts/setup-local-db.ts
 *
 * Prerequisites:
 * 1. Install DynamoDB Local: docker run -p 8000:8000 amazon/dynamodb-local
 * 2. Set DYNAMODB_ENDPOINT=http://localhost:8000 in .env.local
 */

import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
  region: "eu-west-2",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLES = {
  CONTENT: "wrs-content",
  ARTICLES: "wrs-articles",
  EVENTS: "wrs-events",
  GALLERY: "wrs-gallery",
  SUBSCRIBERS: "wrs-subscribers",
};

async function createTable(tableName: string, pkName: string, skName?: string) {
  const keySchema = [{ AttributeName: pkName, KeyType: "HASH" as const }];
  const attributeDefinitions = [{ AttributeName: pkName, AttributeType: "S" as const }];

  if (skName) {
    keySchema.push({ AttributeName: skName, KeyType: "RANGE" as const });
    attributeDefinitions.push({ AttributeName: skName, AttributeType: "S" as const });
  }

  try {
    await client.send(new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: "PAY_PER_REQUEST",
    }));
    console.log(`Created table: ${tableName}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ResourceInUseException") {
      console.log(`Table already exists: ${tableName}`);
    } else {
      throw error;
    }
  }
}

async function seedData() {
  // Seed articles
  const articles = [
    {
      id: uuidv4(),
      slug: "overcome-fear-public-speaking",
      title: "5 Proven Strategies to Overcome Your Fear of Public Speaking",
      excerpt: "Public speaking doesn't have to be terrifying. Learn practical techniques to manage anxiety and deliver confident presentations.",
      content: "<p>Public speaking is one of the most common fears, but it doesn't have to hold you back...</p>",
      author: "Sarah Mitchell",
      status: "published",
      image: "https://cdn.lindoai.com/wrs/blog1.webp",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      slug: "power-of-storytelling",
      title: "The Power of Storytelling in Business Presentations",
      excerpt: "Discover how incorporating stories into your presentations can captivate your audience and make your message memorable.",
      content: "<p>Stories have been used to communicate since the dawn of humanity...</p>",
      author: "James Thompson",
      status: "published",
      image: "https://cdn.lindoai.com/wrs/blog2.webp",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const article of articles) {
    await docClient.send(new PutCommand({
      TableName: TABLES.ARTICLES,
      Item: article,
    }));
  }
  console.log(`Seeded ${articles.length} articles`);

  // Seed events
  const events = [
    {
      id: uuidv4(),
      title: "Weekly Meeting - Table Topics Night",
      description: "<p>Join us for an exciting Table Topics night where you'll practice impromptu speaking.</p>",
      date: "2026-01-28",
      time: "7:00 PM - 9:00 PM",
      location: "Leeds Civic Hall, Calverley Street, Leeds LS1 1UR",
      image: "https://cdn.lindoai.com/wrs/event1.webp",
      registrationUrl: "https://www.toastmasters.org",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Monthly Contest - Best Speaker",
      description: "<p>Our monthly contest to crown the best speaker of the month.</p>",
      date: "2026-02-11",
      time: "7:00 PM - 9:00 PM",
      location: "Leeds Civic Hall, Calverley Street, Leeds LS1 1UR",
      image: "https://cdn.lindoai.com/wrs/event2.webp",
      registrationUrl: "",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const event of events) {
    await docClient.send(new PutCommand({
      TableName: TABLES.EVENTS,
      Item: event,
    }));
  }
  console.log(`Seeded ${events.length} events`);

  // Seed team members
  const teamMembers = [
    {
      PK: `TEAM#${uuidv4()}`,
      SK: "MEMBER",
      id: uuidv4(),
      name: "Sarah Mitchell",
      role: "Club President",
      description: "Sarah has been a Toastmaster for 5 years and is passionate about helping others find their voice.",
      image: "https://cdn.lindoai.com/wrs/team1.webp",
      order: 0,
      active: true,
    },
    {
      PK: `TEAM#${uuidv4()}`,
      SK: "MEMBER",
      id: uuidv4(),
      name: "James Thompson",
      role: "VP Education",
      description: "James designs our educational programs to help members achieve their speaking goals.",
      image: "https://cdn.lindoai.com/wrs/team2.webp",
      order: 1,
      active: true,
    },
    {
      PK: `TEAM#${uuidv4()}`,
      SK: "MEMBER",
      id: uuidv4(),
      name: "Priya Sharma",
      role: "VP Membership",
      description: "Priya welcomes new members and helps them get started on their Toastmasters journey.",
      image: "https://cdn.lindoai.com/wrs/team3.webp",
      order: 2,
      active: true,
    },
  ];

  for (const member of teamMembers) {
    await docClient.send(new PutCommand({
      TableName: TABLES.CONTENT,
      Item: member,
    }));
  }
  console.log(`Seeded ${teamMembers.length} team members`);

  // Seed testimonials
  const testimonials = [
    {
      PK: `TESTIMONIAL#${uuidv4()}`,
      SK: "ITEM",
      id: uuidv4(),
      quote: "Joining White Rose Speakers was the best decision I made for my career. My confidence has grown tremendously!",
      author: "Michael Brown",
      role: "Club Member",
      rating: 5,
      order: 0,
      active: true,
    },
    {
      PK: `TESTIMONIAL#${uuidv4()}`,
      SK: "ITEM",
      id: uuidv4(),
      quote: "The supportive environment helped me overcome my fear of public speaking. I now present confidently at work.",
      author: "Emma Wilson",
      role: "Club Member",
      rating: 5,
      order: 1,
      active: true,
    },
    {
      PK: `TESTIMONIAL#${uuidv4()}`,
      SK: "ITEM",
      id: uuidv4(),
      quote: "Great community of speakers. The feedback is constructive and everyone is so welcoming.",
      author: "David Chen",
      role: "New Member",
      rating: 5,
      order: 2,
      active: true,
    },
  ];

  for (const testimonial of testimonials) {
    await docClient.send(new PutCommand({
      TableName: TABLES.CONTENT,
      Item: testimonial,
    }));
  }
  console.log(`Seeded ${testimonials.length} testimonials`);

  // Seed settings
  const settings = {
    PK: "SETTINGS",
    SK: "SITE",
    meetingDay: "Tuesday",
    meetingTime: "7:00 PM",
    meetingLocation: "Leeds Civic Hall, Calverley Street, Leeds LS1 1UR",
    nextMeetingDate: "2026-01-28",
    contactEmail: "info@whiterosespeakers.co.uk",
    clubUrl: "https://www.toastmasters.org/Find-a-Club/00007933-white-rose-speakers",
    youtubeVideoId: "dQw4w9WgXcQ",
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.CONTENT,
    Item: settings,
  }));
  console.log("Seeded site settings");
}

async function main() {
  console.log("Setting up local DynamoDB...\n");

  // Check connection
  try {
    const { TableNames } = await client.send(new ListTablesCommand({}));
    console.log("Connected to DynamoDB Local");
    console.log("Existing tables:", TableNames?.join(", ") || "none");
  } catch (error) {
    console.error("Failed to connect to DynamoDB Local.");
    console.error("Make sure DynamoDB Local is running:");
    console.error("  docker run -p 8000:8000 amazon/dynamodb-local");
    process.exit(1);
  }

  // Create tables
  console.log("\nCreating tables...");
  await createTable(TABLES.CONTENT, "PK", "SK");
  await createTable(TABLES.ARTICLES, "id");
  await createTable(TABLES.EVENTS, "id");
  await createTable(TABLES.GALLERY, "category", "id");
  await createTable(TABLES.SUBSCRIBERS, "email");

  // Seed data
  console.log("\nSeeding data...");
  await seedData();

  console.log("\n✅ Local database setup complete!");
  console.log("\nYou can now:");
  console.log("  1. Start the dev server: npm run dev");
  console.log("  2. Go to http://localhost:3002/admin/login");
  console.log("  3. Login with any email/password (dev mode enabled)");
}

main().catch(console.error);
