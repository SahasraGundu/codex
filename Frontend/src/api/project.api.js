import api from './config';

/**
 * Auto-save project code to database
 * @param {string} projectId
 * @param {string} code
 */
export const saveProjectCode = (projectId, code) => {
  return api.put(`/projects/${projectId}`, { code });
};

// export const executeProjectCodeApi = (projectId, payload) => {
//   return api.post(`/projects/${projectId}/execute`, payload);
// };

export const executeProjectCode = (id, code, language) => {
  return api.post(`/projects/${id}/execute`, {
    code,
    language,
  });
};