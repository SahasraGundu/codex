import {
  createProject,
  getAllProjects,
  getProjectById,
  reviewProject,
  updateProject,
} from '../services/project.service.js';
import axios from "axios";


export async function createProjectController(req, res) {
  try {
    const { projectName } = req.body;
    if (!projectName || projectName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }
    const newProject = await createProject({ name: projectName, teamName: req.user.teamName });
    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
}
export async function getAllProjectsController(req, res) {
  try {
    const projects = await getAllProjects(req.user.teamName);
    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
}

// Get project by ID
export async function getProjectController(req, res) {
  try {
    const { id } = req.params;
    const project = await getProjectById(id, req.user.teamName);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//  Update project (e.g., code)
export async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const { code } = req.body; // Assume updating code
    const project = await updateProject(id, { code }, req.user.teamName);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// AI Review
export async function reviewProjectController(req, res) {
  try {
    const { id } = req.params;
    const { review } = await reviewProject(id, req.user.teamName);
    return res.status(200).json({
      success: true,
      message: 'Review completed',
      data: { review },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function executeProjectCodeController(req, res) {
  try {
    const { code, language } = req.body;

    const languageMap = {
      javascript: { language: "javascript", version: "18.15.0" },
      python: { language: "python", version: "3.10.0" },
      java: { language: "java", version: "15.0.2" },
      cpp: { language: "cpp", version: "10.2.0" }
    };

    const langConfig = languageMap[language];

    if (!langConfig) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            content: code
          }
        ]
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data.run.output,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Execution failed",
    });
  }
}