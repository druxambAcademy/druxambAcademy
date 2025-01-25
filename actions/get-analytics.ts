import { Purchase } from "@/mongodb/Purchase"; // Mongoose Purchase model

// Define the PurchaseWithCourse type for Mongoose
type PurchaseWithCourse = {
  _id: string;
  course: {
    _id: string;
    title: string;
    price: number;
    userId: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

// Update the PopulatedPurchase type to match the lean() output
type PopulatedPurchase = {
  course?: {
    _id: string;
    title: string;
    price: number;
    userId: string;
  };
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    // Fetch purchases where the user owns the course
    const purchases = await Purchase.find({
      course: { $exists: true }, // Ensure that the purchase is associated with a course
    })
      .populate({
        path: 'course', // Populate the course information
        match: { userId: userId }, // Filter by the course owner
      })
      .lean(); // Use lean() for performance, returning plain JS objects

    // Update the filter and type assertion
    const validPurchases = (purchases as PopulatedPurchase[])
      .filter((purchase): purchase is PurchaseWithCourse => 
        purchase.course !== undefined && 
        typeof purchase.course === 'object' &&
        'title' in purchase.course &&
        'price' in purchase.course
      );

    // Group the purchases by course and sum their revenue
    const groupedEarnings = groupByCourse(validPurchases);
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    // Calculate total revenue and total sales
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = validPurchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
