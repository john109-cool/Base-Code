"use server";

import { suggestColors } from "@/ai/flows/suggest-colors";

export async function suggestColorsAction(): Promise<
  { primaryColor: string; backgroundColor: string; accentColor: string } | { error: string }
> {
  try {
    const colors = await suggestColors();
    return colors;
  } catch (error) {
    console.error("Error suggesting colors:", error);
    return { error: "Failed to suggest colors. Please try again." };
  }
}
