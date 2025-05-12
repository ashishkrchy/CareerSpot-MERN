import Job from '../models/job.model.js';
import mongoose from 'mongoose';

export const createJob = async (req, res) => {
  try {
    let {
      title,
      description,
      requirements,
      experience,
      position,
      jobType,
      location,
      company,
      salary,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !experience ||
      !position ||
      !jobType ||
      !location ||
      !company ||
      !salary
    ) {
      return res
        .status(400)
        .json({ message: 'All fields are required', success: false });
    }

    title = title.trim();
    description = description.trim();

    position = position.trim();
    location = location.trim();
    jobType = jobType.trim();

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res
        .status(400)
        .json({ message: 'Invalid company ID', success: false });
    }

    if (!['full-time', 'part-time', 'internship'].includes(jobType)) {
      return res
        .status(400)
        .json({ message: 'Invalid job type', success: false });
    }

    const { _id: userId } = req.user;

    const job = new Job({
      title,
      description,
      requirements,
      experience,
      position,
      jobType,
      location,
      company,
      salary,
      created_by: userId,
    });

    await job.save();

    res
      .status(201)
      .json({ message: 'Job created successfully', success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || '';

    let query = {};
    if (keyword) {
      query = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { requirements: { $regex: keyword, $options: 'i' } },
          { position: { $regex: keyword, $options: 'i' } },
        ],
      };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('company', 'name location logo');

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found', success: false });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: 'Invalid job ID', success: false });
    }

    const job = await Job.findById(id)
      .populate('company', 'name location logo')
      .populate({
        path: 'applicants',
        populate: { path: 'applicant', select: 'fullname email role' },
      });

    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res
        .status(400)
        .json({ message: 'Invalid admin ID', success: false });
    }

    const jobs = await Job.find({ created_by: adminId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: 'company',
      });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found', success: false });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};
