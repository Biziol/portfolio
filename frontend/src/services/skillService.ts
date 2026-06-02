import type { Skill } from "../interfaces/Skill";
import { apiClient } from "./apiClient";

export async function getAllSkills() {
  return apiClient
    .get(`/skills`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function getSkillById(skillId: number) {
  return apiClient
    .get(`/skills/${skillId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export async function createSkill(skill: Skill) {
  return apiClient
    .post(`/skills`, skill)
    .then((res) => res.data)
    .catch(() => {});
}

export async function updateSkill(skillId: number, skill: Skill) {
  return apiClient
    .put(`/skills/${skillId}`, skill)
    .then((res) => res.data)
    .catch(() => {});
}

export async function deleteSkill(skillId: number) {
  return apiClient
    .delete(`/skills/${skillId}`)
    .then((res) => res.data)
    .catch(() => {});
}

export default {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
