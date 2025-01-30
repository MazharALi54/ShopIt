import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import MetaData from "../layout/MetaData";
import AdminLayout from '../layout/AdminLayout'
import { useDeleteReviewMutation, useLazyGetProductReviewsQuery } from "../../redux/api/productsApi";

const ProductReviews = () => {

    const [productId, setProductId] = useState("")

    const [getProductReviews, { data, isLoading, error }] = useLazyGetProductReviewsQuery()
    const [deleteReview, { isLoading: isDeleteLoading, error: deleteError, isSuccess }] = useDeleteReviewMutation()

    const submitHandler = (e) => {
        e.preventDefault()

        getProductReviews(productId)
    }

    const deleteReviewHanlder = (id) => {
        deleteReview({ productId, id })
    }

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message);
        }

        if (isSuccess) {
            toast.success("Review deleted");
        }
    }, [error, deleteError, isSuccess]);

    const setReviews = () => {
        const reviews = {
            columns: [
                {
                    label: "Review ID",
                    field: "id",
                    sort: "asc",
                },
                {
                    label: "Rating",
                    field: "rating",
                    sort: "asc",
                },
                {
                    label: "Comment",
                    field: "comment",
                    sort: "asc",
                },
                {
                    label: "User",
                    field: "user",
                    sort: "asc",
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc",
                },
            ],
            rows: [],
        };

        data?.reviews?.forEach((review) => {
            reviews.rows.push({
                id: review?._id,
                rating: review?.rating,
                comment: review?.comment,
                user: review?.user?.name,
                actions: (
                    <>
                        <button className="btn btn-outline-danger ms-2" onClick={() => deleteReviewHanlder(review?._id)} disabled={isDeleteLoading}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </>
                ),
            });
        });

        return reviews;
    };

    if (isLoading) return <Loader />;

    return (
        <AdminLayout>
            <MetaData title={"Product Reviews"} />

            <div className="row justify-content-center my-5">
                <div className="col-6">
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label htmlFor="productId_field" className="form-label">
                                Enter Product ID
                            </label>
                            <input
                                type="text"
                                id="productId_field"
                                className="form-control"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>

                        <button
                            id="search_button"
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                        >
                            SEARCH
                        </button>
                    </form>
                </div>
            </div>

            <MDBDataTable
                data={setReviews()}
                className="px-3"
                bordered
                striped
                hover
            />
        </AdminLayout>
    )
}

export default ProductReviews