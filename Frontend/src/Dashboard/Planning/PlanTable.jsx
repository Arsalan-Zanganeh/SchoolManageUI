import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime.replace(' ', 'T'));
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const PlanTable = ({ plans, deletePlan }) => {
    return (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            {plans.length > 0 ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Date & Time</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Duration (mins)</TableCell>
                            <TableCell>Explanation</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>{formatDateTime(plan.StartDate)}</TableCell>
                                <TableCell>{plan.Title}</TableCell>
                                <TableCell>{plan.Duration}</TableCell>
                                <TableCell>{plan.Explanation}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => deletePlan(plan.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Box padding={3}>
                    <Typography variant="h6" align="center">No tasks assigned yet</Typography>
                </Box>
            )}
        </TableContainer>
    );
};

export default PlanTable;
