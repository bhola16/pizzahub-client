const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

interface ImgBBResponse {
  success: boolean;
  data?: {
    display_url: string;
    url: string;
  };
  error?: {
    message: string;
  };
}

interface AddMenuItemResponse {
  message?: string;
  upgradeRequired?: boolean;
  success?: boolean;
}

async function getApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid server response.");
  }
}

export async function uploadMenuItemImage(imageUrl: string): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", imageUrl);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await getApiResponse<ImgBBResponse>(response);
  // console.log("ImgBB upload result:", result);

  if (!response.ok || !result.success || !result.data?.display_url) {
    throw new Error(
      result.error?.message || "Failed to upload image to ImgBB.",
    );
  }

  return result.data.display_url;
}

export async function addMenuItem(menuItem: {
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorName: string;
  vendorEmail: string;
  plan: string;
}): Promise<AddMenuItemResponse> {
  const response = await fetch(`${SERVER_URL}/menuItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  const result = await getApiResponse<AddMenuItemResponse>(response);

  if (!response.ok) {
    if (result.upgradeRequired) return result;

    throw new Error(result.message || "Failed to add menu item.");
  }

  return result;
}


export async function uploadEditMenuItemImage(
  imageUrl: string,
): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", imageUrl);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await getApiResponse<ImgBBResponse>(response);

  if (!response.ok || !result.success || !result.data?.display_url) {
    throw new Error(
      result.error?.message || "Failed to upload image to ImgBB.",
    );
  }

  return result.data.display_url;
}

