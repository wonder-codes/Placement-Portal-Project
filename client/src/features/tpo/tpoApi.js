import { api } from '../../services/api';

export const tpoApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: () => '/tpo/analytics',
        }),
        getUsersToVerify: builder.query({
            query: () => '/tpo/users',
            providesTags: ['User'],
        }),
        verifyUser: builder.mutation({
            query: (id) => ({
                url: `/tpo/verify/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['User'],
        }),
        getTpoStudents: builder.query({
            query: () => '/tpo/students',
            providesTags: ['Student'],
        }),
        updateTpoStudentStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/tpo/students/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Student'],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetUsersToVerifyQuery,
    useVerifyUserMutation,
    useGetTpoStudentsQuery,
    useUpdateTpoStudentStatusMutation
} = tpoApi;
