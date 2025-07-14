import { axiosInstance } from "@/utils/axios.util";
import { IPost } from "../interface/post.interface";

export async function getCompletedPosts(pageParam: number, limit = 50) {
  const { data } = await axiosInstance({
    method: "GET",
    url: `/post/completed?page=${pageParam}&limit=${limit}`,
  });
  return data as {
    docs: IPost[];
    prevPage: number | null;
    nextPage: number | null;
  };
}

export async function getPendingPosts(pageParam: number, limit = 10) {
  const { data } = await axiosInstance({
    method: "GET",
    url: `/post/pending?page=${pageParam}&limit=${limit}`,
  });
  return data as {
    docs: IPost[];
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
    totalDocs: number;
  };
}

export async function editPostComment(payload: {
  profileId: string;
  activityUrn: string;
  commentContent: string;
}) {
  const { data } = await axiosInstance({
    method: "PATCH",
    url: `/post/comment`,
    data: payload,
  });
  return data;
}

export async function approvePosts(payload: {
  posts: {
    activityUrn: string;
    profileId: string;
  }[];
}) {
  const { data } = await axiosInstance({
    method: "POST",
    url: `/comment-scheduler/schedule`,
    data: payload,
  });
  return data;
}
