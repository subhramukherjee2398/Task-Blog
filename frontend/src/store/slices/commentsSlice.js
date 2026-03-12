import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ postId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/post/${postId}`, { params: { page, limit } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ content, postId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/comments', { content, postId });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/${id}`, { content });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const fetchMyComments = createAsyncThunk(
  'comments/fetchMyComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/comments/my-comments');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your comments');
    }
  }
);

const initialState = {
  comments: [],
  myComments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  }
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          pages: action.payload.pages || 1
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my comments
      .addCase(fetchMyComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyComments.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload;
      })
      .addCase(fetchMyComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
