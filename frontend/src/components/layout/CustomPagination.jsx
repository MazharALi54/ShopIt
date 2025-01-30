import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination';
import { useNavigate, useSearchParams } from 'react-router-dom'

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {

    const navigate = useNavigate()

    let [searchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState()

    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        setCurrentPage(page)
    },[page])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        if(searchParams.has("page")){
            searchParams.set("page", pageNumber)
        } else {
            searchParams.append("page", pageNumber)
        }

        const path = window.location.pathname + "?" + searchParams.toString();

        navigate(path);
    }

    return (
        <div className='d-flex justify-content-center my-5'>
            {filteredProductsCount > resPerPage && (
                <Pagination
                    itemClass='page-item'
                    linkClass='page-link'
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProductsCount}
                    onChange={handlePageChange}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                />
            )}
        </div>
    )
}

export default CustomPagination