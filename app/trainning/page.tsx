// app/posts/page.tsx

// Import Prisma client so we can talk to the database
import { prisma } from "@/lib/prisma";

// This is a SERVER component by default (no "use client")
// It runs on the server, not in the browser
export default async function PostsPage() {

  // Because this runs on the server, we can directly query the database
  // No fetch, no API route needed
  const posts = await prisma.post.findMany();

  return (
    <div>
      <h1>Posts</h1>

      {/* Loop through all posts and display them */}
      {posts.map((post) => (
        <p key={post.id}>
          {post.title}
        </p>
      ))}
    </div>
  );
}


"use client"; // This tells Next.js this component runs in the browser

import { useState } from "react";

export default function Counter() {

  // useState only works in CLIENT components
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* When clicked, update state */}
      <button onClick={() => setCount(count + 1)}>
        Clicks: {count}
      </button>
    </div>
  );
}

// app/actions/post.ts

"use server"; // Marks this file/function as server-only

// Import database client
import { prisma } from "@/lib/prisma";

// Import cache revalidation
import { revalidatePath } from "next/cache";

// This function will run on the server when form is submitted
export async function createPost(formData: FormData) {

  // Extract values from form
  const title = formData.get("title") as string;

  // Save data directly into database
  await prisma.post.create({
    data: {
      title: title,
    },
  });

  // Refresh the posts page so new data shows
  revalidatePath("/posts");
}

// app/posts/new/page.tsx

// Import the server action
import { createPost } from "@/app/actions/post";

export default function NewPostPage() {

  return (
    // action={createPost} connects form directly to server function
    <form action={createPost}>

      {/* Input name must match formData.get("title") */}
      <input name="title" placeholder="Title" />

      <button type="submit">
        Save
      </button>
    </form>
  );
}


// Prisma Schema (One-to-Many)

// prisma/schema.prisma

model User {
  id    Int    @id @default(autoincrement()) // Primary key
  email String @unique                      // Unique email

  // One user can have many posts
  posts Post[]
}

model Post {
  id    Int    @id @default(autoincrement())
  title String

  // Foreign key to User
  authorId Int

  // Relation definition
  author User @relation(fields: [authorId], references: [id])
}


// Many-to-Many (Explicit with koppeltabel)
model User {
  id       Int           @id @default(autoincrement())

  // Relation through join table
  projects UserProject[]
}

model Project {
  id       Int           @id @default(autoincrement())

  // Relation through join table
  users    UserProject[]
}

// This is the KOPPELTABEL (join table)
model UserProject {
  userId    Int
  projectId Int

  // Relations to both tables
  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])

  // Composite primary key (unique combination)
  @@id([userId, projectId])
}

// Hashing + Login
import bcrypt from "bcrypt";

// Hash password before saving to database
export async function hashPassword(password: string) {

  // 10 = salt rounds (security level)
  const hashed = await bcrypt.hash(password, 10);

  return hashed;
}

// Compare entered password with stored hash
export async function checkPassword(
  password: string,
  hash: string
) {

  // Returns true or false
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
}

// Role-based access
// Example user object
const user = {
  role: "ADMIN",
};

// Server-side protection (REAL security)
if (user.role !== "ADMIN") {
  throw new Error("Access denied");
}

// Client-side (UI only, not secure)
{user.role === "ADMIN" && (
  <a href="/admin">Admin Panel</a>
)}

// revalidatePath
import { revalidatePath } from "next/cache";

// After creating/updating/deleting data
revalidatePath("/posts");