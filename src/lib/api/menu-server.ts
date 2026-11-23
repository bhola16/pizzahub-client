import { getServerToken } from "@/lib/core/server";
import "server-only";



export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  location: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  vendorAddress?: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const token = await getServerToken();

  if (!token) {
    throw new Error("Authentication failed. Please log in again.");
  }

  const response = await fetch(`${SERVER_URL}/menuItems/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const result: { data?: MenuItem | null } = await response.json();
  return result.data || null;
}
