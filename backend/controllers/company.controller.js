import Company from '../models/company.model.js';
import fs from 'fs';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';

export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location, logo } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Company name is required',
        success: false,
      });
    }

    const userId = req.user._id;

    const newCompany = await Company.create({
      name,
      description,
      website,
      location,
      logo,
      userId,
    });

    return res.status(201).json({
      message: 'Company registered successfully',
      success: true,
      company: {
        id: newCompany._id,
        name: newCompany.name,
        description: newCompany.description,
        website: newCompany.website,
        location: newCompany.location,
        logo: newCompany.logo,
      },
    });
  } catch (error) {
    console.error('Error during company registration:', error);

    
    if (error.code === 11000 && error.keyValue?.name) {
      return res.status(409).json({
        message: 'Company name already exists',
        success: false,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;

    const companies = await Company.find({ userId });

    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No companies found', success: false });
    }

    res.status(200).json({
      message: 'Companies retrieved successfully',
      success: true,
      companies,
    });
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const id = req.params.id;

    const company = await Company.findById(id);

    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found', success: false });
    }

    res.status(200).json({
      message: 'Company retrieved successfully',
      success: true,
      company: {
        id: company._id,
        name: company.name,
        description: company.description,
        website: company.website,
        location: company.location,
        logo: company.logo,
      },
    });
  } catch (error) {
    console.error('Error getting company:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name, description, website, location } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found', success: false });
    }

   
    if (req.files && req.files.logo && req.files.logo[0]) {
      const logoPath = req.files.logo[0].path;


      const uploadResult = await uploadToCloudinary(logoPath, {
        folder: 'company-logos',
      });

     
      fs.unlinkSync(logoPath);

     
      if (company.logo) {
        const publicId = company.logo.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`company-logos/${publicId}`);
      }

     
      company.logo = uploadResult.secure_url;
    }

    company.name = name || company.name;
    company.description = description || company.description;
    company.website = website || company.website;
    company.location = location || company.location;

    await company.save();

    res.status(200).json({
      message: 'Company updated successfully',
      success: true,
      company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};
