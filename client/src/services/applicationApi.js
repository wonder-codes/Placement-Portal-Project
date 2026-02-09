import { api } from './api';

export const applicationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobApplications: builder.query({
            query: (jobId) => `/applications/job/${jobId}`,
            providesTags: ['Application'],
        }),
        updateApplicationStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/applications/${id}/status`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Application', 'Student'],
        }),
    }),
});

export const {
    useGetJobApplicationsQuery,
    useUpdateApplicationStatusMutation
} = applicationApi;
