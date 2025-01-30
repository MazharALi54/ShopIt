import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    tagTypes: ["AdminOrders", "Order"],
    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
            query(body) {
                return {
                    url: "/orders/new",
                    method: "POST",
                    body,
                }
            }
        }),
        stripeCheckoutSession: builder.mutation({
            query(body) {
                return {
                    url: "/payment/checkout_session",
                    method: "POST",
                    body,
                }
            }
        }),
        myOrders: builder.query({
            query: () => `/me/orders`,
        }),
        orderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: ["Order"]
        }),
        getSalesData: builder.query({
            query: ({ startDate, endDate }) => ({
                url: `/admin/sales`,
                params: { startDate, endDate },
            }),
        }),
        getAdminOrders: builder.query({
            query: () => `/admin/orders`,
            providesTags: ["AdminOrders", "Order"]
        }),
        updateOrderStatus: builder.mutation({
            query({ id, body }) {
                return {
                    url: `admin/orders/${id}`,
                    method: "POST",
                    body
                }
            },
            invalidatesTags: ["Order"]
        }),
        deleteOrder: builder.mutation({
            query(id) {
                return {
                    url: `admin/orders/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: ["AdminOrders"]
        }),
    })
})

export const {
    useCreateNewOrderMutation,
    useStripeCheckoutSessionMutation,
    useMyOrdersQuery,
    useOrderDetailsQuery,
    useLazyGetSalesDataQuery,
    useGetAdminOrdersQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation,
} = orderApi