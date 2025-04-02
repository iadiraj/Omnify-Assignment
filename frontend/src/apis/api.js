import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const getAllBlogs = async (pageOffset = 0, pageSize = 10) => {
  try {
    const response = await axios.get("/api/v1/blogs", {
      params: { pageOffset, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const getMyBlogs = async (pageOffset = 0, pageSize = 10) => {
  try {
    const response = await axios.get("/api/v1/blogs/myblogs", {
      params: { pageOffset, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const getBlog = async (id) => {
  try {
    const response = await axios.get(`/api/v1/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const deleteBlog = async (id, accessToken) => {
  try {
    const response = await axios.delete(`/api/v1/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (id, blogDto, accessToken) => {
  try {
    const response = await axios.patch(`/api/v1/blogs/${id}`, blogDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const createBlog = async (blogDto, accessToken) => {
  try {
    const response = await axios.post("/api/v1/blogs", blogDto, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};
