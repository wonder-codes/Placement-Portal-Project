import { api } from '../../services/api';

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
            invalidatesTags: ['Application', 'Job', 'Student'], // update Student to reflect placement status if changed? Or just app list. Also jobs might show "applied" status.
        }),
    }),
});

export const {
    useGetStudentProfileQuery,
    useUpdateStudentProfileMutation,
    useGetMyApplicationsQuery,
    useApplyForJobMutation
} = studentApi;
