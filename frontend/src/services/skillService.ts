import type { Skill } from "../interfaces/Skill";
import { apiClient } from "./apiClient";

export async function getAllSkills() {
  return apiClient
    .get(`/skills`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function getSkillById(skillId: number) {
  return apiClient
    .get(`/skills/${skillId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function createSkill(skill: Skill) {
  return apiClient
    .post(`/skills`, skill)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function updateSkill(skillId: number, skill: Skill) {
  return apiClient
    .put(`/skills/${skillId}`, skill)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export async function deleteSkill(skillId: number) {
  return apiClient
    .delete(`/skills/${skillId}`)
    .then((res) => res.data)
    .catch((e) => {
      const errorMessage = e.response?.data || e.message || "Unknown error";
      throw new Error(errorMessage);
    });
}

export default {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
