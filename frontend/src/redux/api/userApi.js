import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, setLoading } from "../features/userSlice"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    tagTypes: ["User", "AdminUsers"],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/profile',
            // transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data.user));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setLoading(false));
                } catch (error) {
                    dispatch(setLoading(false));
                    console.log(error)
                }
            },
            providesTags: ["User"]
        }),
        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/upload-avatar",
                    method: "PUT",
                    body,
                    headers: {
                        "Content-Type": "application/json",
                      },
                };
            },
            invalidatesTags: ["User"],
        }),
        updateProfile: builder.mutation({
            query(body) {
                return {
                    url: "/update-profile",
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["User"]
        }),
        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/update-password",
                    method: "PUT",
                    body,
                }
            }
        }),
        getAdminUsers: builder.query({
            query: () => `/admin/users`,
            providesTags: ["AdminUsers"]
        }),
        getUserDetail: builder.query({
            query: (id) => `/admin/users/${id}`,
            providesTags: ["AdminUsers"]
        }),
        updateUser: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/admin/users/${id}`,
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["AdminUsers"]
        }),
        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/admin/users/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: ["AdminUsers"]
        }),
    })
})
export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useUploadAvatarMutation,
    useGetAdminUsersQuery,
    useGetUserDetailQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApi;