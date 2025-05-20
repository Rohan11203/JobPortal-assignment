import { Router } from "express";
import { ApplicationModel, JobModel } from "../DB";
import { Userauth } from "../auth";

export const JobRouter = Router();

JobRouter.post("/add", Userauth, async (req: any, res: any) => {
  const userId = req.user._id;
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      category,
    } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res
        .status(400)
        .json({ msg: "Please fill in all required fields" });
    }

    const savedJob = await JobModel.create({
      title,
      company,
      userId,
      location,
      type,
      salary,
      description,
      requirements,
      category,
    });

    res.status(201).json(savedJob);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

JobRouter.get("/", async (req, res) => {
  try {
    const queryParams = req.query as { [key: string]: string };
    const filter: Record<string, any> = {};

    if (queryParams.category) {
      filter.category = queryParams.category;
    }

    if (queryParams.q) {
      const regex = new RegExp(queryParams.q, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }
    console.log(filter);

    const jobs = await JobModel.find(filter);
    console.log(jobs);
    res.json(jobs);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

JobRouter.get("/employer/dashboard", Userauth, async (req: any, res: any) => {
  try {
    console.log(req.user);
    const company = req.user.company;
    if (!company) {
      return res.status(400).json({ msg: "Employer company not set on user" });
    }

    const activeJobs = await JobModel.find({ company }).lean();

    const applications = await ApplicationModel.find({
      jobId: { $in: activeJobs.map((j) => j._id) },
    }).lean();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const monthlyAgg = await JobModel.aggregate([
      { $match: { company, postedDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$postedDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);
    // map month numbers to names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = monthlyAgg.map((m) => ({
      month: monthNames[m._id.month - 1],
      jobs: m.count,
    }));

    //  Jobs by category
    const categoryAgg = await JobModel.aggregate([
      { $match: { company } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    const categoryData = categoryAgg.map((c) => ({
      name: c._id,
      value: c.count,
    }));

    const recentApps = await ApplicationModel.find({
      jobId: { $in: activeJobs.map((j) => j._id) },
    })
      .sort({ appliedDate: -1 })
      .limit(5)
      .populate("jobId", "title")
      .populate("userId", "name")
      .lean();

    const recentApplications = recentApps.map((app: any) => ({
      id: app._id,
      jobTitle: app.jobId.title,
      applicant: app.userId.name,
      appliedDate: app.appliedDate.toISOString().split("T")[0], // YYYY-MM-DD
      status: app.status,
    }));

    const totalApplications = applications.length;
    const pendingCount = applications.filter(
      (a) => a.status === "pending"
    ).length;
    const acceptedCount = applications.filter(
      (a) => a.status === "accepted"
    ).length;

    return res.json({
      activeJobsCount: activeJobs.length,
      totalApplications,
      pendingCount,
      acceptedCount,
      monthlyData,
      categoryData,
      recentApplications,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});
JobRouter.get("/:id", async (req: any, res: any) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid job ID" });
    }
    res.status(500).send("Server Error");
  }
});

JobRouter.post("/:jobId/apply", Userauth, async (req: any, res: any) => {
  try {
    console.log("here");
    const { jobId } = req.params;
    const userId = req.user._id; 

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const existing = await ApplicationModel.findOne({ jobId, userId });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "You have already applied to this job" });
    }

    const application = new ApplicationModel({
      jobId,
      userId,
    });
    await application.save();

    res.status(201).json(application);
  } catch (err: any) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid job ID" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
});

JobRouter.get("/jobseeker/dashboard", Userauth, async (req: any, res) => {
  try {
    const userId = req.user._id;

    const applications = await ApplicationModel.find({ userId })
      .sort({ appliedDate: -1 })
      .lean();

    const jobIds = applications.map((a) => a.jobId);
    const jobs = await JobModel.find({ _id: { $in: jobIds } })
      .select("title company")
      .lean();

    const totalApplications = applications.length;
    const pendingCount = applications.filter(
      (a) => a.status === "pending"
    ).length;
    const acceptedCount = applications.filter(
      (a) => a.status === "accepted"
    ).length;
    const rejectedCount = applications.filter(
      (a) => a.status === "rejected"
    ).length;

    const history = applications.map((app) => {
      const job = jobs.find((j) => j._id.toString() === app.jobId.toString());
      return {
        id: app._id,
        jobTitle: job?.title || "Unknown",
        company: job?.company || "Unknown",
        appliedDate: app.appliedDate.toISOString().split("T")[0],
        status: app.status,
      };
    });

    const now = new Date();
    const activity = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (i + 1) * 7);
      const end = new Date(now);
      end.setDate(now.getDate() - i * 7);
      const count = applications.filter(
        (app) => app.appliedDate >= start && app.appliedDate < end
      ).length;
      activity.push({ week: `Week ${6 - i}`, applications: count });
    }

    res.json({
      totalApplications,
      pendingCount,
      acceptedCount,
      rejectedCount,
      activity,
      history,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
