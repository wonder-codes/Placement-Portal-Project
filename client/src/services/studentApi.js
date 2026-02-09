import { api } from './api';

export const studentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudentProfile: builder.query({
            query: () => '/students/profile',
            providesTags: ['Student'],
        }),
        updateStudentProfile: builder.mutation({
            query: (data) => ({
                url: '/students/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Student'],
        }),
        getMyApplications: builder.query({
            query: () => '/applications/my',
            providesTags: ['Application'],
        }),
        applyForJob: builder.mutation({
            query: ({ jobId }) => ({
                url: '/applications',
                method: 'POST',
                body: { jobId },
            }),
            invalidatesTags: ['Application', 'Job', 'Student'],
        }),
        respondToOffer: builder.mutation({
            query: ({ applicationId, response }) => ({
                url: `/applications/${applicationId}/respond`,
                method: 'PUT',
                body: { response },
            }),
            invalidatesTags: ['Application', 'Student'],
        }),
    }),
});

export const {
    useGetStudentProfileQuery,
    useUpdateStudentProfileMutation,
    useGetMyApplicationsQuery,
    useApplyForJobMutation,
    useRespondToOfferMutation
} = studentApi;
