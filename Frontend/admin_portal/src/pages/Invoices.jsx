import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { invoiceAPI } from '../services/api';

const Invoices = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: invoicesData, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceAPI.getAllInvoices(),
  });

  const invoices = invoicesData?.data || [];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = !searchTerm || 
      inv.id?.toString().includes(searchTerm) ||
      inv.invoiceNumber?.includes(searchTerm) ||
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = async (invoiceId) => {
    try {
      const response = await invoiceAPI.downloadInvoice(invoiceId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      enqueueSnackbar('Invoice downloaded successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to download invoice', { variant: 'error' });
    }
  };

  if (error) {
    return (
      <Alert severity="error">
        Failed to load invoices: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Invoice Management</Typography>
        </Box>

        <Card>
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No invoices found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.invoiceNumber || `INV-${invoice.id}`}</TableCell>
                            <TableCell>{invoice.customerName || 'N/A'}</TableCell>
                            <TableCell>TZS {invoice.totalAmount?.toLocaleString() || 0}</TableCell>
                            <TableCell>
                              <Chip
                                label={invoice.status || 'N/A'}
                                size="small"
                                color={
                                  invoice.status === 'PAID' ? 'success' :
                                  invoice.status === 'PENDING' ? 'warning' : 'error'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => handleDownload(invoice.id)}
                                >
                                  Download
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredInvoices.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Invoices;

