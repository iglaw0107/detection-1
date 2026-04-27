import Crime from "../models/crime.model";

// 🔥 COMMON MATCH BUILDER
const buildMatch = (userId?: string, location?: string) => {
  const match: any = {};

  // include BOTH global + user data
  if (userId) {
    match.$or = [
      { userId },
      { userId: { $exists: false } }
    ];
  }

  if (location) match.location = location;

  return match;
};

// 🔥 TOP CRIMES
export const getTopCrimes = async (userId?: string, location?: string) => {
  const match = buildMatch(userId, location);

  return await Crime.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$predictedCrime",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};

// 🔥 CRIME TRENDS (FIXED DATE)
export const getCrimeTrends = async (userId?: string, location?: string) => {
  const match = buildMatch(userId, location);

  return await Crime.aggregate([
    { $match: match },

    {
      $addFields: {
        parsedDate: {
          $dateFromString: {
            dateString: "$date",
            format: "%m-%d-%Y %H:%M",
            onError: new Date("2020-01-01"),
          },
        },
      },
    },

    {
      $group: {
        _id: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$parsedDate",
            },
          },
          crimeType: "$predictedCrime", // 🔥 IMPORTANT
        },
        count: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: "$_id.month",
        crimeType: "$_id.crimeType",
        count: 1,
      },
    },

    { $sort: { _id: 1 } },
  ]);
};

// 🔥 RISK DISTRIBUTION
export const getRiskDistribution = async (userId?: string, location?: string) => {
  const match = buildMatch(userId, location);

  const result = await Crime.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$riskLevel",
        count: { $sum: 1 },
      },
    },
  ]);

  const distribution: any = {
    high: 0,
    medium: 0,
    low: 0,
  };

  result.forEach((r) => {
    if (r._id) {
      distribution[r._id] = r.count;
    }
  });

  return distribution;
};

// 🔥 DASHBOARD STATS (FIXED)
export const getDashboardStats = async (userId?: string, location?: string) => {
  const match = buildMatch(userId, location);

  const totalCrimes = await Crime.countDocuments(match);

  const high = await Crime.countDocuments({
    ...match,
    riskLevel: "high", // ✅ FIXED
  });

  const medium = await Crime.countDocuments({
    ...match,
    riskLevel: "medium", // ✅ FIXED
  });

  const low = await Crime.countDocuments({
    ...match,
    riskLevel: "low", // ✅ FIXED
  });

  return {
    totalCrimes,
    bySeverity: {
      high,
      medium,
      low,
    },
  };
};

// 🔥 REAL HOTSPOTS (LAT + LNG)
export const getCrimeHotspots = async (userId?: string, location?: string) => {
  const match = buildMatch(userId, location);

  return await Crime.aggregate([
    { $match: match },

    {
      $group: {
        _id: {
          lat: "$lat",
          lng: "$lng",
          location: "$location",
        },
        count: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: 0,
        lat: "$_id.lat",
        lng: "$_id.lng",
        location: "$_id.location",
        count: 1,
      },
    },

    { $sort: { count: -1 } },
  ]);
};