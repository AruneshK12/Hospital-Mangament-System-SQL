import {Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React from "react";

const TableLoadingSkeleton = () => {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: "auto", margin: "auto" }}>
            <Table>
                <TableBody>
                    {Array.from(new Array(5)).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from(new Array(3)).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableLoadingSkeleton;