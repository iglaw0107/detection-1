import Crime from "../models/crime.model";

// 🔥 TOP CRIMES
export const getTopCrimes = async (userId?: string) => {
  const matchStage = userId ? { userId } : {};

  const result = await Crime.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$predictedCrime",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return result;
};

// 🔥 CRIME TRENDS (by date)
export const getCrimeTrends = async (userId?: string) => {
  const matchStage = userId ? { userId } : {};

  const result = await Crime.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$date",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result;
};

// 🔥 RISK DISTRIBUTION
export const getRiskDistribution = async (userId?: string) => {
  const matchStage = userId ? { userId } : {};

  const result = await Crime.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$riskLevel",
        count: { $sum: 1 },
      },
    },
  ]);

  return result;
};

// 🔥 DASHBOARD STATS
export const getDashboardStats = async (userId?: string) => {
  const matchStage = userId ? { userId } : {};

  const total = await Crime.countDocuments(matchStage);

  const highRisk = await Crime.countDocuments({
    ...matchStage,
    riskLevel: "high",
  });

  return {
    totalPredictions: total,
    highRiskCases: highRisk,
  };
};