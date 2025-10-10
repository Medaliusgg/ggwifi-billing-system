import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDate, formatCurrency, formatStatus } from '@/utils/formatters';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  actions = true,
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleAction = (action, row) => {
    handleMenuClose();
    switch (action) {
      case 'view':
        onView?.(row);
        break;
      case 'edit':
        onEdit?.(row);
        break;
      case 'delete':
        onDelete?.(row);
        break;
      case 'activate':
        onStatusChange?.(row, 'ACTIVE');
        break;
      case 'deactivate':
        onStatusChange?.(row, 'INACTIVE');
        break;
      default:
        break;
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row, index) => index);
      onSelectionChange?.(newSelected);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (event, index) => {
    event.stopPropagation();
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, index];
    } else {
      newSelected = selectedRows.filter((item) => item !== index);
    }

    onSelectionChange?.(newSelected);
  };

  const isSelected = (index) => selectedRows.indexOf(index) !== -1;

  const renderCellValue = (column, row) => {
    const value = row[column.field];

    switch (column.type) {
      case 'date':
        return formatDate(value);
      case 'currency':
        return formatCurrency(value);
      case 'status':
        const status = formatStatus(value);
        return (
          <Chip
            label={status.label}
            size="small"
            color={status.color}
            variant="outlined"
            sx={{
              borderColor: status.color === 'success' ? '#4CAF50' : 
                         status.color === 'error' ? '#F44336' : 
                         status.color === 'warning' ? '#FF9800' : '#9E9E9E',
              color: status.color === 'success' ? '#4CAF50' : 
                     status.color === 'error' ? '#F44336' : 
                     status.color === 'warning' ? '#FF9800' : '#9E9E9E',
            }}
          />
        );
      case 'phone':
        return formatPhoneNumber(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value || '-';
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography className="text-gg-text-muted">Loading...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        className="card"
        sx={{
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#2E2E2E',
                  '& .MuiTableCell-head': {
                    color: '#FFD700',
                    fontWeight: 600,
                    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                  },
                }}
              >
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                      checked={data.length > 0 && selectedRows.length === data.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: '#FFD700',
                        '&.Mui-checked': {
                          color: '#FFD700',
                        },
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.field} align={column.align || 'left'}>
                    {column.headerName}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="right">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => {
                const isItemSelected = isSelected(index);
                
                return (
                  <motion.tr
                    key={row.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableRow
                      hover
                      selected={isItemSelected}
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.05)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        },
                        '& .MuiTableCell-body': {
                          color: '#FFFFFF',
                          borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                        },
                      }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleSelectRow(event, index)}
                            onClick={(event) => event.stopPropagation()}
                            sx={{
                              color: '#FFD700',
                              '&.Mui-checked': {
                                color: '#FFD700',
                              },
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.field} align={column.align || 'left'}>
                          {renderCellValue(column, row)}
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, row)}
                            className="text-gg-text-muted hover:text-gg-gold"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            sx={{
              backgroundColor: '#2E2E2E',
              color: '#FFFFFF',
              borderTop: '1px solid rgba(255, 215, 0, 0.1)',
              '& .MuiTablePagination-toolbar': {
                color: '#FFFFFF',
              },
              '& .MuiTablePagination-selectLabel': {
                color: '#BFBFBF',
              },
              '& .MuiTablePagination-displayedRows': {
                color: '#FFFFFF',
              },
            }}
          />
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2E2E2E',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={() => handleAction('view', selectedRow)}>
          <ListItemIcon>
            <ViewIcon className="text-gg-gold" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit', selectedRow)}>
          <ListItemIcon>
            <EditIcon className="text-gg-gold" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('activate', selectedRow)}>
          <ListItemIcon>
            <CheckCircleIcon className="text-green-400" />
          </ListItemIcon>
          <ListItemText>Activate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('deactivate', selectedRow)}>
          <ListItemIcon>
            <BlockIcon className="text-red-400" />
          </ListItemIcon>
          <ListItemText>Deactivate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete', selectedRow)}>
          <ListItemIcon>
            <DeleteIcon className="text-red-400" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default DataTable;
