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
  Skeleton,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ggwifiTheme from '/src/theme/ggwifiTheme.js';

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
  title = '',
  subtitle = '',
  emptyMessage = 'No data available',
  searchable = false,
  onSearch,
  searchValue = '',
  filters = [],
  onFilterChange,
  sortable = true,
  onSort,
  sortBy = '',
  sortDirection = 'asc',
  dense = false,
  stickyHeader = false,
  maxHeight = 400,
  rowHeight = 52,
  hover = true,
  striped = false,
  borderless = false,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleAction = (action, rowId) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        onEdit?.(rowId);
        break;
      case 'delete':
        onDelete?.(rowId);
        break;
      case 'view':
        onView?.(rowId);
        break;
      case 'block':
        onStatusChange?.(rowId, 'blocked');
        break;
      case 'activate':
        onStatusChange?.(rowId, 'active');
        break;
      default:
        break;
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.id);
      onSelectionChange?.(newSelected);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (event, rowId) => {
    if (event.target.checked) {
      onSelectionChange?.([...selectedRows, rowId]);
    } else {
      onSelectionChange?.(selectedRows.filter((id) => id !== rowId));
    }
  };

  const isSelected = (rowId) => selectedRows.includes(rowId);

  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'status':
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: value === 'active' 
                ? 'rgba(76, 175, 80, 0.1)' 
                : value === 'inactive'
                ? 'rgba(244, 67, 54, 0.1)'
                : 'rgba(255, 152, 0, 0.1)',
              color: value === 'active' 
                ? ggwifiTheme.colors.success 
                : value === 'inactive'
                ? ggwifiTheme.colors.error
                : ggwifiTheme.colors.warning,
              border: `1px solid ${value === 'active' 
                ? ggwifiTheme.colors.success 
                : value === 'inactive'
                ? ggwifiTheme.colors.error
                : ggwifiTheme.colors.warning}`,
              fontFamily: ggwifiTheme.typography.fontFamily.primary,
              fontWeight: ggwifiTheme.typography.fontWeight.medium,
            }}
          />
        );
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          borderRadius: ggwifiTheme.borderRadius.lg,
          boxShadow: ggwifiTheme.shadows.lg,
          border: `1px solid rgba(245, 183, 0, 0.1)`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Golden Accent Border */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: ggwifiTheme.gradients.primary,
            zIndex: 1,
          }}
        />

        {/* Table Header */}
        {(title || subtitle) && (
          <Box sx={{ p: 3, pb: 2 }}>
            {title && (
              <Typography
                variant="h6"
                sx={{
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                  fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                  color: ggwifiTheme.colors.secondary,
                  mb: subtitle ? 1 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: ggwifiTheme.colors.neutral,
                  fontFamily: ggwifiTheme.typography.fontFamily.primary,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Table Container */}
        <TableContainer
          sx={{
            maxHeight: maxHeight,
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(245, 183, 0, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: ggwifiTheme.colors.primary,
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: ggwifiTheme.colors.primaryHover,
            },
          }}
        >
          <Table
            stickyHeader={stickyHeader}
            size={dense ? 'small' : 'medium'}
            sx={{
              '& .MuiTableHead-root': {
                backgroundColor: 'rgba(245, 183, 0, 0.05)',
              },
              '& .MuiTableCell-head': {
                backgroundColor: 'rgba(245, 183, 0, 0.05)',
                color: ggwifiTheme.colors.secondary,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                fontSize: ggwifiTheme.typography.fontSize.sm,
                borderBottom: `2px solid ${ggwifiTheme.colors.primary}`,
              },
              '& .MuiTableCell-body': {
                color: ggwifiTheme.colors.secondary,
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                fontSize: ggwifiTheme.typography.fontSize.sm,
                borderBottom: `1px solid rgba(245, 183, 0, 0.1)`,
              },
              '& .MuiTableRow-root': {
                transition: ggwifiTheme.transitions.normal,
                '&:hover': hover ? {
                  backgroundColor: 'rgba(245, 183, 0, 0.05)',
                  cursor: onRowClick ? 'pointer' : 'default',
                } : {},
                '&:nth-of-type(even)': striped ? {
                  backgroundColor: 'rgba(245, 183, 0, 0.02)',
                } : {},
              },
            }}
          >
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 && selectedRows.length < data.length
                      }
                      checked={data.length > 0 && selectedRows.length === data.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: ggwifiTheme.colors.primary,
                        '&.Mui-checked': {
                          color: ggwifiTheme.colors.primary,
                        },
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sortDirection={sortBy === column.id ? sortDirection : false}
                    sx={{
                      minWidth: column.minWidth || 100,
                      width: column.width,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          fontWeight: ggwifiTheme.typography.fontWeight.semibold,
                          color: ggwifiTheme.colors.secondary,
                        }}
                      >
                        {column.label}
                      </Typography>
                      {sortable && column.sortable !== false && (
                        <SecurityIcon sx={{ fontSize: 16, color: ggwifiTheme.colors.neutral }} />
                      )}
                    </Box>
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="right" sx={{ width: 80 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Skeleton variant="rectangular" width={24} height={24} />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="right">
                        <Skeleton variant="rectangular" width={32} height={32} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 48, color: ggwifiTheme.colors.neutral, mb: 2 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: ggwifiTheme.colors.neutral,
                          fontFamily: ggwifiTheme.typography.fontFamily.primary,
                        }}
                      >
                        {emptyMessage}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableRow
                      hover={hover}
                      selected={isSelected(row.id)}
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(245, 183, 0, 0.05)',
                        },
                      }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected(row.id)}
                            onChange={(event) => handleSelectRow(event, row.id)}
                            sx={{
                              color: ggwifiTheme.colors.primary,
                              '&.Mui-checked': {
                                color: ggwifiTheme.colors.primary,
                              },
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            color: ggwifiTheme.colors.secondary,
                            fontFamily: ggwifiTheme.typography.fontFamily.primary,
                          }}
                        >
                          {formatCellValue(row[column.id], column)}
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, row.id)}
                            sx={{
                              color: ggwifiTheme.colors.neutral,
                              '&:hover': {
                                color: ggwifiTheme.colors.primary,
                                backgroundColor: 'rgba(245, 183, 0, 0.1)',
                              },
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
              borderTop: `1px solid rgba(245, 183, 0, 0.1)`,
              backgroundColor: 'rgba(245, 183, 0, 0.02)',
              '& .MuiTablePagination-toolbar': {
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                color: ggwifiTheme.colors.secondary,
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontFamily: ggwifiTheme.typography.fontFamily.primary,
                color: ggwifiTheme.colors.secondary,
              },
            }}
          />
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            '& .MuiPaper-root': {
              background: ggwifiTheme.gradients.card,
              borderRadius: ggwifiTheme.borderRadius.md,
              border: `1px solid rgba(245, 183, 0, 0.2)`,
              boxShadow: ggwifiTheme.shadows.golden,
            },
          }}
        >
          {onView && (
            <MenuItem onClick={() => handleAction('view', selectedRowId)}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View</ListItemText>
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem onClick={() => handleAction('edit', selectedRowId)}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          )}
          {onStatusChange && (
            <>
              <MenuItem onClick={() => handleAction('activate', selectedRowId)}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Activate</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleAction('block', selectedRowId)}>
                <ListItemIcon>
                  <BlockIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Block</ListItemText>
              </MenuItem>
            </>
          )}
          {onDelete && (
            <MenuItem onClick={() => handleAction('delete', selectedRowId)}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Paper>
    </motion.div>
  );
};

export default DataTable;