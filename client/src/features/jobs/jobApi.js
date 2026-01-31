import { api } from '../../services/api';

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: () => '/jobs',
            providesTags: ['Job'],
        }),
        getMyJobs: builder.query({
            query: () => '/jobs/my',
            providesTags: ['Job'],
        }),
        getJob: builder.query({
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
        getJobApplications: builder.query({
            query: (jobId) => `/applications/job/${jobId}`,
            providesTags: ['Application'],
        }),
        updateApplicationStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/applications/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Application', 'Student', 'Job'],
        }),
    }),
});

export const {
    useGetJobsQuery,
    useGetMyJobsQuery,
    useGetJobQuery,
    useCreateJobMutation,
    useGetJobApplicationsQuery,
    useUpdateApplicationStatusMutation
} = jobApi;
