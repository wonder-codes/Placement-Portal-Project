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
    }),
});

export const { useGetAnalyticsQuery, useGetUsersToVerifyQuery, useVerifyUserMutation } = tpoApi;
