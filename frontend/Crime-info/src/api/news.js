import axios from "axios";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

/**
 * Get crime-related news (optionally location-based)
 */
export const getCrimeNews = async (location = "") => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 2);

  const fromDate = past.toISOString().split("T")[0];

  // 🔥 Build smarter query
  const query = location
    ? `"${location}" AND (crime OR robbery OR murder OR theft)`
    : "(crime OR robbery OR murder OR theft)";

  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything`, {
        params: {
          q: query,
          from: fromDate,
          sortBy: "publishedAt",
          language: "en",
          apiKey: API_KEY,
        },
      }
    );

    return res;
  } catch (error) {
    console.error("News API Error:", error);

    // 🚨 Fallback: general crime news if location fails
    try {
      const fallback = await axios.get(
        `https://newsapi.org/v2/top-headlines`, {
          params: {
            q: "crime OR robbery OR theft",
            country: "in",
            apiKey: API_KEY,
          },
        }
      );

      return fallback;
    } catch (fallbackError) {
      console.error("Fallback News Error:", fallbackError);

      return {
        data: {
          articles: [],
        },
      };
    }
  }
};