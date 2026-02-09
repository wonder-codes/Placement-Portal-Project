import { api } from './api';

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: () => '/jobs',
            providesTags: ['Job'],
        }),
        getJobById: builder.query({
            query: (id) => `/jobs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Job', id }],
        }),
        createJob: builder.mutation({
            query: (data) => ({
                url: '/jobs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Job'],
        }),
        updateJob: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/jobs/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Job'],
        }),
        getMyJobs: builder.query({
            query: () => '/jobs/my',
            providesTags: ['Job'],
        }),
    }),
});

export const {
    useGetJobsQuery,
    useGetJobByIdQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useGetMyJobsQuery
} = jobApi;
