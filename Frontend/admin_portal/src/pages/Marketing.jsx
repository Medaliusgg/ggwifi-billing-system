import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Typography,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon,
  Segment as SegmentIcon,
  Sms as SmsIcon,
  VideoLibrary as VideoIcon,
  AutoGraph as AutomationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { marketingAPI } from '../services/api';

const TabPanel = ({ value, index, children }) => {
  if (value !== index) return null;
  return (
    <Box sx={{ mt: 3 }}>
      {children}
    </Box>
  );
};

const eventTypeOptions = [
  'CUSTOMER_BIRTHDAY',
  'INACTIVE_USER',
  'POST_PURCHASE',
  'LOW_BALANCE',
  'HIGH_USAGE',
  'LOYALTY_TIER_UPGRADE',
  'REFERRAL_SUCCESS',
];

const campaignTypeOptions = [
  'SMS_BROADCAST',
  'SMS_AUTOMATION',
  'SCHEDULED_PROMOTION',
  'VIDEO_CAMPAIGN',
  'IMAGE_CAMPAIGN',
];

const frequencyOptions = ['ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'CRON'];

const mediaTypeOptions = ['VIDEO', 'IMAGE'];

const templateCategories = ['MARKETING', 'TRANSACTIONAL', 'OTP'];

const MarketingManagement = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [mediaCampaigns, setMediaCampaigns] = useState([]);
  const [automationTriggers, setAutomationTriggers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);

  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [segmentDialogOpen, setSegmentDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    campaignType: 'SMS_BROADCAST',
    channel: 'SMS',
    status: 'DRAFT',
    autoRepeat: false,
  });

  const [segmentForm, setSegmentForm] = useState({
    name: '',
    description: '',
    rulesJson: '{"inactiveDays":14}',
  });

  const [templateForm, setTemplateForm] = useState({
    title: '',
    contentBody: '',
    category: 'MARKETING',
    variables: '{name}',
  });

  const [mediaForm, setMediaForm] = useState({
    title: '',
    mediaType: 'VIDEO',
    fileUrl: '',
    durationSeconds: 6,
    skipAllowed: false,
    priority: 5,
  });

  const [automationForm, setAutomationForm] = useState({
    eventType: 'CUSTOMER_BIRTHDAY',
    templateId: '',
    delayMinutes: 0,
    repeatAllowed: true,
  });

  const [scheduleForm, setScheduleForm] = useState({
    linkedCampaignId: '',
    frequency: 'ONE_TIME',
    timeOfDay: '09:00',
  });

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const [
        campaignsRes,
        segmentsRes,
        templatesRes,
        mediaRes,
        automationRes,
        schedulesRes,
        logsRes,
      ] = await Promise.allSettled([
        marketingAPI.getCampaigns(),
        marketingAPI.getSegments(),
        marketingAPI.getTemplates(),
        marketingAPI.getMediaCampaigns(),
        marketingAPI.getAutomationTriggers(),
        marketingAPI.getSchedules(),
        marketingAPI.getLogs(),
      ]);

      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.data || []);
      if (segmentsRes.status === 'fulfilled') setSegments(segmentsRes.value.data || []);
      if (templatesRes.status === 'fulfilled') setTemplates(templatesRes.value.data || []);
      if (mediaRes.status === 'fulfilled') setMediaCampaigns(mediaRes.value.data || []);
      if (automationRes.status === 'fulfilled') setAutomationTriggers(automationRes.value.data || []);
      if (schedulesRes.status === 'fulfilled') setSchedules(schedulesRes.value.data || []);
      if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data || []);
    } catch (error) {
      console.error('Failed to load marketing data', error);
      enqueueSnackbar('Failed to load marketing data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const handleCreateCampaign = async () => {
    try {
      await marketingAPI.createCampaign(campaignForm);
      enqueueSnackbar('Campaign created', { variant: 'success' });
      setCampaignDialogOpen(false);
      setCampaignForm({
        name: '',
        description: '',
        campaignType: 'SMS_BROADCAST',
        channel: 'SMS',
        status: 'DRAFT',
        autoRepeat: false,
      });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to create campaign', error);
      enqueueSnackbar('Failed to create campaign', { variant: 'error' });
    }
  };

  const handleSendCampaign = async (campaignId) => {
    try {
      await marketingAPI.sendCampaign(campaignId);
      enqueueSnackbar('Campaign triggered', { variant: 'success' });
    } catch (error) {
      console.error('Failed to send campaign', error);
      enqueueSnackbar('Failed to send campaign', { variant: 'error' });
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await marketingAPI.deleteCampaign(campaignId);
      enqueueSnackbar('Campaign deleted', { variant: 'success' });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to delete campaign', error);
      enqueueSnackbar('Failed to delete campaign', { variant: 'error' });
    }
  };

  const handleCreateSegment = async () => {
    try {
      JSON.parse(segmentForm.rulesJson || '{}');
      await marketingAPI.saveSegment(segmentForm);
      enqueueSnackbar('Segment saved', { variant: 'success' });
      setSegmentDialogOpen(false);
      setSegmentForm({
        name: '',
        description: '',
        rulesJson: '{"inactiveDays":14}',
      });
      fetchMarketingData();
    } catch (error) {
      enqueueSnackbar('Invalid JSON rules or failed to save segment', { variant: 'error' });
    }
  };

  const handleDeleteSegment = async (segmentId) => {
    try {
      await marketingAPI.deleteSegment(segmentId);
      enqueueSnackbar('Segment removed', { variant: 'success' });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to delete segment', error);
      enqueueSnackbar('Failed to delete segment', { variant: 'error' });
    }
  };

  const handleCreateTemplate = async () => {
    try {
      await marketingAPI.saveTemplate(templateForm);
      enqueueSnackbar('Template saved', { variant: 'success' });
      setTemplateDialogOpen(false);
      setTemplateForm({
        title: '',
        contentBody: '',
        category: 'MARKETING',
        variables: '{name}',
      });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to save template', error);
      enqueueSnackbar('Failed to save template', { variant: 'error' });
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await marketingAPI.deleteTemplate(templateId);
      enqueueSnackbar('Template deleted', { variant: 'success' });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to delete template', error);
      enqueueSnackbar('Failed to delete template', { variant: 'error' });
    }
  };

  const handleCreateMediaCampaign = async () => {
    try {
      await marketingAPI.saveMediaCampaign(mediaForm);
      enqueueSnackbar('Media campaign saved', { variant: 'success' });
      setMediaDialogOpen(false);
      setMediaForm({
        title: '',
        mediaType: 'VIDEO',
        fileUrl: '',
        durationSeconds: 6,
        skipAllowed: false,
        priority: 5,
      });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to save media campaign', error);
      enqueueSnackbar('Failed to save media campaign', { variant: 'error' });
    }
  };

  const handleCreateAutomation = async () => {
    try {
      await marketingAPI.saveAutomationTrigger(automationForm);
      enqueueSnackbar('Automation trigger saved', { variant: 'success' });
      setAutomationDialogOpen(false);
      setAutomationForm({
        eventType: 'CUSTOMER_BIRTHDAY',
        templateId: '',
        delayMinutes: 0,
        repeatAllowed: true,
      });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to save automation trigger', error);
      enqueueSnackbar('Failed to save automation trigger', { variant: 'error' });
    }
  };

  const handleDeleteAutomation = async (triggerId) => {
    try {
      await marketingAPI.deleteAutomationTrigger(triggerId);
      enqueueSnackbar('Automation trigger deleted', { variant: 'success' });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to delete automation trigger', error);
      enqueueSnackbar('Failed to delete automation trigger', { variant: 'error' });
    }
  };

  const handleCreateSchedule = async () => {
    try {
      await marketingAPI.saveSchedule(scheduleForm);
      enqueueSnackbar('Schedule saved', { variant: 'success' });
      setScheduleDialogOpen(false);
      setScheduleForm({
        linkedCampaignId: '',
        frequency: 'ONE_TIME',
        timeOfDay: '09:00',
      });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to save schedule', error);
      enqueueSnackbar('Failed to save schedule', { variant: 'error' });
    }
  };

  const handlePauseSchedule = async (scheduleId) => {
    try {
      await marketingAPI.pauseSchedule(scheduleId);
      enqueueSnackbar('Schedule paused', { variant: 'info' });
      fetchMarketingData();
    } catch (error) {
      console.error('Failed to pause schedule', error);
      enqueueSnackbar('Failed to pause schedule', { variant: 'error' });
    }
  };

  const handleRefresh = () => {
    fetchMarketingData();
  };

  const renderTable = (rows, columns, emptyLabel = 'No records found') => {
    if (loading) {
      return (
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (!rows.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {emptyLabel}
        </Typography>
      );
    }

    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id || row.segmentId || row.templateId}>
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {typeof col.render === 'function' ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Marketing Automation Suite
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage campaigns, segments, templates, media ads, and automation workflows
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCampaignDialogOpen(true)}
          >
            New Campaign
          </Button>
        </Stack>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<CampaignIcon />} iconPosition="start" label="Campaigns" />
        <Tab icon={<SegmentIcon />} iconPosition="start" label="Audience Segments" />
        <Tab icon={<SmsIcon />} iconPosition="start" label="SMS Templates" />
        <Tab icon={<VideoIcon />} iconPosition="start" label="Media & Automation" />
      </Tabs>

      {/* Campaigns */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader
            title="Campaigns"
            subheader="SMS broadcasts, scheduled promotions, and automation journeys"
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCampaignDialogOpen(true)}
                >
                  Create Campaign
                </Button>
              </Stack>
            }
          />
          <CardContent>
            {renderTable(campaigns, [
              { field: 'name', headerName: 'Name' },
              { field: 'campaignType', headerName: 'Type' },
              { field: 'status', headerName: 'Status', render: (row) => <Chip label={row.status} size="small" /> },
              { field: 'channel', headerName: 'Channel' },
              {
                field: 'actions',
                headerName: 'Actions',
                render: (row) => (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<SendIcon />}
                      onClick={() => handleSendCampaign(row.campaignId || row.id)}
                    >
                      Send
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteCampaign(row.campaignId || row.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                ),
              },
            ])}
          </CardContent>
        </Card>

        <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader
              title="Recent Delivery Logs"
              subheader="SMS and marketing delivery events"
            />
            <CardContent>
              {renderTable(logs, [
                { field: 'phoneNumber', headerName: 'Recipient' },
                { field: 'channel', headerName: 'Channel' },
                { field: 'status', headerName: 'Status', render: (row) => <Chip label={row.status} size="small" color={row.status === 'FAILED' ? 'warning' : 'success'} /> },
                { field: 'sentAt', headerName: 'Timestamp', render: (row) => row.sentAt ? new Date(row.sentAt).toLocaleString() : '—' },
              ], 'No delivery logs yet')}
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {/* Segments */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardHeader
            title="Audience Segments"
            subheader="Targeting rules for campaigns and automation"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setSegmentDialogOpen(true)}
              >
                New Segment
              </Button>
            }
          />
          <CardContent>
            {renderTable(segments, [
              { field: 'name', headerName: 'Name' },
              { field: 'description', headerName: 'Description' },
              {
                field: 'estimatedCount',
                headerName: 'Audience Size',
                render: (row) => row.estimatedCount ?? '—',
              },
              {
                field: 'actions',
                headerName: 'Actions',
                render: (row) => (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteSegment(row.segmentId || row.id)}
                  >
                    Delete
                  </Button>
                ),
              },
            ], 'No segments defined yet')}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Templates */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardHeader
            title="SMS Templates"
            subheader="Reusable templates with dynamic placeholders"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setTemplateDialogOpen(true)}
              >
                New Template
              </Button>
            }
          />
          <CardContent>
            {renderTable(templates, [
              { field: 'title', headerName: 'Title' },
              { field: 'category', headerName: 'Category' },
              { field: 'contentBody', headerName: 'Content' },
              {
                field: 'actions',
                headerName: 'Actions',
                render: (row) => (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteTemplate(row.templateId || row.id)}
                  >
                    Delete
                  </Button>
                ),
              },
            ], 'No templates yet')}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Media & Automation */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Portal Media Campaigns"
                subheader="Video & image ads shown on customer portal"
                action={
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setMediaDialogOpen(true)}
                  >
                    New Media
                  </Button>
                }
              />
              <CardContent>
                {renderTable(mediaCampaigns, [
                  { field: 'title', headerName: 'Title' },
                  { field: 'mediaType', headerName: 'Type' },
                  { field: 'durationSeconds', headerName: 'Duration (s)' },
                  { field: 'impressionsCount', headerName: 'Impressions', render: (row) => row.impressionsCount ?? 0 },
                ], 'No media campaigns yet')}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Automation & Scheduling"
                subheader="Lifecycle triggers and recurring schedules"
                action={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setAutomationDialogOpen(true)}
                    >
                      New Automation
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon />}
                      onClick={() => setScheduleDialogOpen(true)}
                    >
                      New Schedule
                    </Button>
                  </Stack>
                }
              />
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Automation Triggers
                </Typography>
                {renderTable(automationTriggers, [
                  { field: 'eventType', headerName: 'Event' },
                  { field: 'templateId', headerName: 'Template' },
                  { field: 'delayMinutes', headerName: 'Delay (mins)' },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    render: (row) => (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteAutomation(row.triggerId || row.id)}
                      >
                        Delete
                      </Button>
                    ),
                  },
                ], 'No automation triggers yet')}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Schedules
                </Typography>
                {renderTable(schedules, [
                  { field: 'linkedCampaignId', headerName: 'Campaign ID' },
                  { field: 'frequency', headerName: 'Frequency' },
                  { field: 'timeOfDay', headerName: 'Time' },
                  { field: 'status', headerName: 'Status', render: (row) => <Chip label={row.status} size="small" /> },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    render: (row) => (
                      <Button
                        size="small"
                        color="warning"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handlePauseSchedule(row.scheduleId || row.id)}
                      >
                        Pause
                      </Button>
                    ),
                  },
                ], 'No schedules configured yet')}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Campaign Dialog */}
      <Dialog open={campaignDialogOpen} onClose={() => setCampaignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Campaign</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={campaignForm.name}
              onChange={(e) => setCampaignForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={campaignForm.description}
              onChange={(e) => setCampaignForm((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              select
              label="Campaign Type"
              value={campaignForm.campaignType}
              onChange={(e) => setCampaignForm((prev) => ({ ...prev, campaignType: e.target.value }))}
            >
              {campaignTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Channel"
              value={campaignForm.channel}
              onChange={(e) => setCampaignForm((prev) => ({ ...prev, channel: e.target.value }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={campaignForm.autoRepeat}
                  onChange={(e) => setCampaignForm((prev) => ({ ...prev, autoRepeat: e.target.checked }))}
                />
              }
              label="Auto Repeat"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCampaignDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCampaign}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Segment Dialog */}
      <Dialog open={segmentDialogOpen} onClose={() => setSegmentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Audience Segment</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={segmentForm.name}
              onChange={(e) => setSegmentForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={segmentForm.description}
              onChange={(e) => setSegmentForm((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Rules (JSON)"
              value={segmentForm.rulesJson}
              onChange={(e) => setSegmentForm((prev) => ({ ...prev, rulesJson: e.target.value }))}
              multiline
              minRows={4}
              fullWidth
              helperText={'Example: {"inactiveDays":14}'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSegmentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSegment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create SMS Template</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={templateForm.title}
              onChange={(e) => setTemplateForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              select
              label="Category"
              value={templateForm.category}
              onChange={(e) => setTemplateForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              {templateCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Content"
              value={templateForm.contentBody}
              onChange={(e) => setTemplateForm((prev) => ({ ...prev, contentBody: e.target.value }))}
              multiline
              minRows={3}
              helperText="Use placeholders like {name}, {points}"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTemplate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Dialog */}
      <Dialog open={mediaDialogOpen} onClose={() => setMediaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Portal Media Campaign</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={mediaForm.title}
              onChange={(e) => setMediaForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              select
              label="Media Type"
              value={mediaForm.mediaType}
              onChange={(e) => setMediaForm((prev) => ({ ...prev, mediaType: e.target.value }))}
            >
              {mediaTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="File URL (CDN)"
              value={mediaForm.fileUrl}
              onChange={(e) => setMediaForm((prev) => ({ ...prev, fileUrl: e.target.value }))}
            />
            <TextField
              label="Duration (seconds)"
              type="number"
              value={mediaForm.durationSeconds}
              onChange={(e) => setMediaForm((prev) => ({ ...prev, durationSeconds: Number(e.target.value) }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mediaForm.skipAllowed}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, skipAllowed: e.target.checked }))}
                />
              }
              label="Allow Skip"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMediaDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateMediaCampaign}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Automation Dialog */}
      <Dialog open={automationDialogOpen} onClose={() => setAutomationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Automation Trigger</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Event Type"
              value={automationForm.eventType}
              onChange={(e) => setAutomationForm((prev) => ({ ...prev, eventType: e.target.value }))}
            >
              {eventTypeOptions.map((event) => (
                <MenuItem key={event} value={event}>
                  {event.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Template"
              value={automationForm.templateId}
              onChange={(e) => setAutomationForm((prev) => ({ ...prev, templateId: e.target.value }))}
            >
              {templates.map((template) => (
                <MenuItem key={template.templateId} value={template.templateId}>
                  {template.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Delay Minutes"
              type="number"
              value={automationForm.delayMinutes}
              onChange={(e) => setAutomationForm((prev) => ({ ...prev, delayMinutes: Number(e.target.value) }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={automationForm.repeatAllowed}
                  onChange={(e) => setAutomationForm((prev) => ({ ...prev, repeatAllowed: e.target.checked }))}
                />
              }
              label="Allow Repeat"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutomationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAutomation}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Scheduler</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Linked Campaign ID"
              value={scheduleForm.linkedCampaignId}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, linkedCampaignId: e.target.value }))}
              helperText="Use the campaign ID returned by the API"
            />
            <TextField
              select
              label="Frequency"
              value={scheduleForm.frequency}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, frequency: e.target.value }))}
            >
              {frequencyOptions.map((frequency) => (
                <MenuItem key={frequency} value={frequency}>
                  {frequency}
                </MenuItem>
              ))}
            </TextField>
            {scheduleForm.frequency === 'CRON' && (
              <TextField
                label="Cron Expression"
                value={scheduleForm.cronExpression || ''}
                onChange={(e) => setScheduleForm((prev) => ({ ...prev, cronExpression: e.target.value }))}
              />
            )}
            <TextField
              label="Time of Day"
              type="time"
              value={scheduleForm.timeOfDay}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, timeOfDay: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSchedule}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketingManagement;

