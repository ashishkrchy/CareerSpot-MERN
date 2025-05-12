import Application from '../models/application.model.js';
import Job from '../models/job.model.js';
import mongoose from 'mongoose';

// Apply to a job
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { _id: userId } = req.user;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this job.',
        success: false,
      });
    }

    // Create new application
    const application = new Application({
      job: jobId,
      applicant: userId,
    });
    await application.save();

    // Add the application ID to Job's applicants array
    job.applicants.push(application._id);
    await job.save();

    res.status(201).json({
      message: 'Application submitted successfully.',
      success: true,
      application,
      totalApplicants: job.applicants.length,
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Get all jobs the current user has applied to
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name location logo' },
      });

    if (!applications.length) {
      return res.status(404).json({
        message: 'No applications found',
        success: false,
      });
    }

    res.status(200).json({
      message: 'Applications fetched successfully.',
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Get all applicants for a job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ message: 'Invalid job ID', success: false });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: 'applicants',
        populate: { path: 'applicant' },
      })
      .populate('company', 'name location logo');

    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    if (!job.applicants.length) {
      return res.status(404).json({
        message: 'No applicants found for this job',
        success: false,
      });
    }

    res.status(200).json({
      message: 'Applicants fetched successfully.',
      success: true,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

// Update application status (by recruiter)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const applicationId = req.params.id;

    const validStatuses = ['Accept', 'Reject', 'Pending'];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: 'Invalid or missing status', success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res
        .status(400)
        .json({ message: 'Invalid application ID', success: false });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ message: 'Application not found', success: false });
    }

    if (status === 'Reject') {
      application.status = 'rejected';
    } else if (status === 'Accept') {
      application.status = 'accepted';
    } else {
      application.status = 'pending';
    }

    await application.save();

    res.status(200).json({
      message: 'Application status updated successfully.',
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};
