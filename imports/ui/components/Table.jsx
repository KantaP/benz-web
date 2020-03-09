import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

export const Table = ({ columns, data , ref }) => {

    return (
        <div>
            <ReactTable
                ref={ref}
                data={data}
                columns={columns}
                defaultPageSize={10}
                className="-striped -highlight"
            />
        </div>
    )
} 
