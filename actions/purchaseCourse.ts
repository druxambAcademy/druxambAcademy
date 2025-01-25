import { IPurchase } from "@/mongodb/Purchase";
import axios from "axios";

export async function purchaseCourse(courseId: string): Promise<IPurchase> {
  try {
    const response = await axios.post<IPurchase>(
      `/api/courses/${courseId}/purchase`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (
        error.response.status === 400 &&
        error.response.data === "Already purchased"
      ) {
        throw new Error("You have already purchased this course");
      }
      throw new Error(
        error.response.data || "An error occurred while purchasing the course"
      );
    }
    throw error;
  }
}
