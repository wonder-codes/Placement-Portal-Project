import { api } from './api';

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query({
            query: () => '/companies',
            providesTags: ['Company'],
        }),
        createCompany: builder.mutation({
            query: (data) => ({
                url: '/companies',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),
        updateCompany: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/companies/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),
        getMyCompany: builder.query({
            query: () => '/companies/my',
            providesTags: ['Company'],
        }),
    }),
});

export const {
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useGetMyCompanyQuery
} = companyApi;
