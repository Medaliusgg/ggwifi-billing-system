package com.ggnetworks.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ggnetworks.entity.*;
import com.ggnetworks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarketingAutomationService {

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private MarketingEventLogRepository marketingEventLogRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AudienceSegmentRepository audienceSegmentRepository;

    @Autowired
    private SmsTemplateRepository smsTemplateRepository;

    @Autowired
    private MediaCampaignRepository mediaCampaignRepository;

    @Autowired
    private MediaImpressionRepository mediaImpressionRepository;

    @Autowired
    private SchedulerConfigRepository schedulerConfigRepository;

    @Autowired
    private AutomationTriggerRepository automationTriggerRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private ObjectMapper objectMapper;

    public List<MarketingCampaign> getCampaigns() {
        return marketingCampaignRepository.findAll();
    }

    public MarketingCampaign createCampaign(MarketingCampaign campaign) {
        if (campaign.getCampaignId() == null || campaign.getCampaignId().isEmpty()) {
            campaign.setCampaignId("MC-" + System.currentTimeMillis());
        }
        return marketingCampaignRepository.save(campaign);
    }

    public MarketingCampaign updateCampaign(String campaignId, MarketingCampaign payload) {
        return marketingCampaignRepository.findByCampaignId(campaignId)
            .map(existing -> {
                existing.setName(payload.getName());
                existing.setDescription(payload.getDescription());
                existing.setCampaignType(payload.getCampaignType());
                existing.setStatus(payload.getStatus());
                existing.setChannel(payload.getChannel());
                existing.setMessageTemplate(payload.getMessageTemplate());
                existing.setSubject(payload.getSubject());
                existing.setScheduleAt(payload.getScheduleAt());
                existing.setTargetFilters(payload.getTargetFilters());
                existing.setAutoRepeat(payload.getAutoRepeat());
                existing.setRepeatIntervalDays(payload.getRepeatIntervalDays());
                existing.setIncludeHotspotCustomers(payload.getIncludeHotspotCustomers());
                existing.setIncludePppoeCustomers(payload.getIncludePppoeCustomers());
                existing.setLoyaltyPointThreshold(payload.getLoyaltyPointThreshold());
                existing.setInactivityDaysThreshold(payload.getInactivityDaysThreshold());
                return marketingCampaignRepository.save(existing);
            })
            .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));
    }

    public void deleteCampaign(String campaignId) {
        marketingCampaignRepository.findByCampaignId(campaignId)
            .ifPresent(marketingCampaignRepository::delete);
    }

    @Transactional
    public Map<String, Object> triggerCampaign(String campaignId) {
        MarketingCampaign campaign = marketingCampaignRepository.findByCampaignId(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));

        List<Customer> audience = resolveAudience(campaign);
        int sent = 0;

        campaign.setStatus(MarketingCampaign.CampaignStatus.RUNNING);
        marketingCampaignRepository.save(campaign);

        String template = resolveTemplate(campaign);
        for (Customer customer : audience) {
            if (customer.getPrimaryPhoneNumber() == null) {
                continue;
            }
            String personalized = renderTemplate(template, customer, campaign);
            sendMessage(campaign, customer, personalized);
            sent++;
        }

        campaign.setLastExecutedAt(LocalDateTime.now());
        campaign.setStatus(MarketingCampaign.CampaignStatus.COMPLETED);
        marketingCampaignRepository.save(campaign);

        Map<String, Object> result = new HashMap<>();
        result.put("campaignId", campaignId);
        result.put("audience", audience.size());
        result.put("messagesSent", sent);
        return result;
    }

    @Transactional
    public int processScheduledCampaigns() {
        List<MarketingCampaign> scheduled = marketingCampaignRepository
            .findByScheduleAtBeforeAndStatus(LocalDateTime.now(), MarketingCampaign.CampaignStatus.SCHEDULED);
        int processed = 0;
        for (MarketingCampaign campaign : scheduled) {
            triggerCampaign(campaign.getCampaignId());
            processed++;
        }
        return processed;
    }

    public List<MarketingEventLog> getLogs(String campaignId) {
        if (campaignId == null || campaignId.isEmpty()) {
            return marketingEventLogRepository.findAll();
        }
        return marketingEventLogRepository.findByCampaignId(campaignId);
    }

    /* Audience segments */
    public List<AudienceSegment> getSegments() {
        return audienceSegmentRepository.findAll();
    }

    public AudienceSegment saveSegment(AudienceSegment payload) {
        if (payload.getSegmentId() == null || payload.getSegmentId().isEmpty()) {
            payload.setSegmentId("SEG-" + System.currentTimeMillis());
        } else {
            audienceSegmentRepository.findBySegmentId(payload.getSegmentId())
                .ifPresent(existing -> payload.setId(existing.getId()));
        }
        evaluateSegment(payload);
        return audienceSegmentRepository.save(payload);
    }

    public void deleteSegment(String segmentId) {
        audienceSegmentRepository.findBySegmentId(segmentId)
            .ifPresent(audienceSegmentRepository::delete);
    }

    private void evaluateSegment(AudienceSegment segment) {
        // Basic estimation until full rule engine implemented
        long activeCustomers = customerRepository.countByIsActiveTrue();
        segment.setEstimatedCount((int) activeCustomers);
        segment.setLastEvaluatedAt(LocalDateTime.now());
    }

    /* SMS templates */
    public List<SmsTemplate> getTemplates() {
        return smsTemplateRepository.findAll();
    }

    public SmsTemplate saveTemplate(SmsTemplate template) {
        if (template.getTemplateId() == null || template.getTemplateId().isEmpty()) {
            template.setTemplateId("TPL-" + System.currentTimeMillis());
        } else {
            smsTemplateRepository.findByTemplateId(template.getTemplateId())
                .ifPresent(existing -> template.setId(existing.getId()));
        }
        return smsTemplateRepository.save(template);
    }

    public void deleteTemplate(String templateId) {
        smsTemplateRepository.findByTemplateId(templateId)
            .ifPresent(smsTemplateRepository::delete);
    }

    /* Media campaigns */
    public List<MediaCampaign> getMediaCampaigns() {
        return mediaCampaignRepository.findAll();
    }

    public MediaCampaign saveMediaCampaign(MediaCampaign mediaCampaign) {
        if (mediaCampaign.getCampaignId() == null || mediaCampaign.getCampaignId().isEmpty()) {
            mediaCampaign.setCampaignId("MEDIA-" + System.currentTimeMillis());
        } else {
            mediaCampaignRepository.findByCampaignId(mediaCampaign.getCampaignId())
                .ifPresent(existing -> mediaCampaign.setId(existing.getId()));
        }
        return mediaCampaignRepository.save(mediaCampaign);
    }

    public Map<String, Object> getActiveMediaForPortal(String device) {
        List<MediaCampaign> active = mediaCampaignRepository.findActiveCampaigns(LocalDateTime.now());
        if (active.isEmpty()) {
            return Collections.emptyMap();
        }
        MediaCampaign selected = active.get(0);
        Map<String, Object> response = new HashMap<>();
        response.put("type", selected.getMediaType().name().toLowerCase(Locale.ROOT));
        response.put("url", selected.getFileUrl());
        response.put("duration", selected.getDurationSeconds());
        response.put("skipAllowed", Boolean.TRUE.equals(selected.getSkipAllowed()));
        response.put("campaignId", selected.getCampaignId());
        response.put("title", selected.getTitle());
        return response;
    }

    public void recordMediaImpression(String campaignId, String phone, String deviceId,
                                      Integer watchedSeconds, Boolean completed, Boolean clicked) {
        MediaImpression impression = new MediaImpression();
        impression.setCampaignId(campaignId);
        impression.setPhoneNumber(phone);
        impression.setDeviceId(deviceId);
        impression.setWatchedSeconds(watchedSeconds);
        impression.setCompleted(completed);
        impression.setClicked(clicked);
        mediaImpressionRepository.save(impression);

        mediaCampaignRepository.findByCampaignId(campaignId).ifPresent(mediaCampaign -> {
            mediaCampaign.setImpressionsCount(mediaCampaign.getImpressionsCount() + 1);
            if (phone != null || deviceId != null) {
                mediaCampaign.setUniqueViewers(mediaCampaign.getUniqueViewers() + 1);
            }
            mediaCampaignRepository.save(mediaCampaign);
        });
    }

    /* Scheduler configs */
    public SchedulerConfig saveSchedulerConfig(SchedulerConfig config) {
        if (config.getScheduleId() == null || config.getScheduleId().isEmpty()) {
            config.setScheduleId("SCH-" + System.currentTimeMillis());
        } else {
            schedulerConfigRepository.findByScheduleId(config.getScheduleId())
                .ifPresent(existing -> config.setId(existing.getId()));
        }
        return schedulerConfigRepository.save(config);
    }

    public List<SchedulerConfig> getActiveSchedulers() {
        return schedulerConfigRepository.findByStatus("ACTIVE");
    }

    public void pauseScheduler(String scheduleId) {
        schedulerConfigRepository.findByScheduleId(scheduleId).ifPresent(config -> {
            config.setStatus("PAUSED");
            schedulerConfigRepository.save(config);
        });
    }

    /* Automation triggers */
    public List<AutomationTrigger> getAutomationTriggers() {
        return automationTriggerRepository.findAll();
    }

    public AutomationTrigger saveAutomationTrigger(AutomationTrigger trigger) {
        if (trigger.getTriggerId() == null || trigger.getTriggerId().isEmpty()) {
            trigger.setTriggerId("AUTO-" + System.currentTimeMillis());
        } else {
            automationTriggerRepository.findByTriggerId(trigger.getTriggerId())
                .ifPresent(existing -> trigger.setId(existing.getId()));
        }
        return automationTriggerRepository.save(trigger);
    }

    public void deleteAutomationTrigger(String triggerId) {
        automationTriggerRepository.findByTriggerId(triggerId)
            .ifPresent(automationTriggerRepository::delete);
    }

    /* Background helpers */
    public void refreshSegmentEstimates() {
        List<AudienceSegment> segments = audienceSegmentRepository.findAll();
        if (segments.isEmpty()) {
            return;
        }
        long activeCount = customerRepository.countByIsActiveTrue();
        LocalDateTime now = LocalDateTime.now();
        for (AudienceSegment segment : segments) {
            segment.setEstimatedCount((int) activeCount);
            segment.setLastEvaluatedAt(now);
        }
        audienceSegmentRepository.saveAll(segments);
    }

    public void runAutomationTriggers() {
        List<AutomationTrigger> triggers = automationTriggerRepository.findByActiveTrue();
        if (triggers.isEmpty()) {
            return;
        }
        LocalDate today = LocalDate.now();
        int month = today.getMonthValue();
        int day = today.getDayOfMonth();

        for (AutomationTrigger trigger : triggers) {
            switch (trigger.getEventType()) {
                case CUSTOMER_BIRTHDAY -> {
                    List<Customer> birthdays = customerRepository.findCustomersWithBirthday(month, day);
                    birthdays.forEach(customer -> sendTemplateMessage(trigger.getTemplateId(), customer, null));
                }
                case INACTIVE_USER -> {
                    int days = extractIntCondition(trigger.getConditionsJson(), "inactiveDays", 14);
                    LocalDateTime threshold = LocalDateTime.now().minusDays(days);
                    List<Customer> inactive = customerRepository.findInactiveSince(threshold);
                    inactive.forEach(customer -> sendTemplateMessage(trigger.getTemplateId(), customer, null));
                }
                default -> {
                    // Extend when more realtime hooks are available
                }
            }
        }
    }

    private List<Customer> resolveAudience(MarketingCampaign campaign) {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
            .filter(c -> c.getStatus() == Customer.CustomerStatus.ACTIVE)
            .filter(c -> includeByAccountType(campaign, c))
            .filter(c -> matchCampaignSpecificCriteria(campaign, c))
            .collect(Collectors.toList());
    }

    private boolean includeByAccountType(MarketingCampaign campaign, Customer customer) {
        boolean includeHotspot = Boolean.TRUE.equals(campaign.getIncludeHotspotCustomers());
        boolean includePppoe = Boolean.TRUE.equals(campaign.getIncludePppoeCustomers());

        if (!includeHotspot && !includePppoe) {
            return true;
        }

        Customer.AccountType accountType = customer.getAccountType();
        boolean isHotspotCustomer = accountType == null || accountType == Customer.AccountType.INDIVIDUAL;
        boolean isPppoeCustomer = accountType == Customer.AccountType.BUSINESS ||
                                  accountType == Customer.AccountType.ENTERPRISE;

        if (includeHotspot && isHotspotCustomer) {
            return true;
        }
        return includePppoe && isPppoeCustomer;
    }

    private boolean matchCampaignSpecificCriteria(MarketingCampaign campaign, Customer customer) {
        switch (campaign.getCampaignType()) {
            case BIRTHDAY -> {
                LocalDate dob = customer.getDateOfBirth();
                if (dob == null) return false;
                LocalDate today = LocalDate.now();
                return dob.getDayOfMonth() == today.getDayOfMonth() &&
                       dob.getMonth() == today.getMonth();
            }
            case FLASH_PROMOTION -> {
                LocalDateTime lastActivity = customer.getLastActivityAt();
                return lastActivity != null && lastActivity.isAfter(LocalDateTime.now().minusDays(7));
            }
            case UPSELL -> {
                Integer threshold = Optional.ofNullable(campaign.getLoyaltyPointThreshold()).orElse(100);
                return customer.getLoyaltyPoints() != null && customer.getLoyaltyPoints() >= threshold;
            }
            case WIN_BACK -> {
                Integer days = Optional.ofNullable(campaign.getInactivityDaysThreshold()).orElse(30);
                LocalDateTime lastActivity = customer.getLastActivityAt();
                return lastActivity == null || lastActivity.isBefore(LocalDateTime.now().minusDays(days));
            }
            case LOYALTY_REMINDER -> {
                Integer threshold = Optional.ofNullable(campaign.getLoyaltyPointThreshold()).orElse(30);
                return customer.getLoyaltyPoints() != null && customer.getLoyaltyPoints() >= threshold;
            }
            default -> {
                return true; // Broadcast / fallback
            }
        }
    }

    private String resolveTemplate(MarketingCampaign campaign) {
        if (campaign.getMessageTemplate() != null && !campaign.getMessageTemplate().isBlank()) {
            return campaign.getMessageTemplate();
        }
        return switch (campaign.getCampaignType()) {
            case BIRTHDAY ->
                "Happy Birthday {{name}}! Enjoy browsing on GG Wi-Fi. Use your GG Points today.";
            case FLASH_PROMOTION ->
                "FLASH PROMO: {{campaignName}} - Limited time offer for our premium plans!";
            case UPSELL ->
                "Hi {{name}}, unlock faster internet with our premium plan. Reply to upgrade instantly.";
            case WIN_BACK ->
                "We miss you {{name}}! Come back to GG Wi-Fi and enjoy a loyalty bonus.";
            case LOYALTY_REMINDER ->
                "You have {{points}} GG Points waiting. Redeem now for exclusive rewards.";
            default ->
                "{{campaignName}} - Stay connected with GG Wi-Fi. {{description}}";
        };
    }

    private String renderTemplate(String template, Customer customer, MarketingCampaign campaign) {
        return renderTemplate(template, customer, campaign, Collections.emptyMap());
    }

    private String renderTemplate(String template, Customer customer, MarketingCampaign campaign,
                                  Map<String, String> extraTokens) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("{{name}}", Optional.ofNullable(customer.getFirstName()).orElse("GG Customer"));
        tokens.put("{{phone}}", customer.getPrimaryPhoneNumber());
        tokens.put("{{points}}", String.valueOf(
            Optional.ofNullable(customer.getLoyaltyPoints()).orElse(0)));
        if (campaign != null) {
            tokens.put("{{campaignName}}", Optional.ofNullable(campaign.getName()).orElse(""));
            tokens.put("{{description}}", Optional.ofNullable(campaign.getDescription()).orElse(""));
        }
        if (extraTokens != null) {
            tokens.putAll(extraTokens);
        }

        String message = template;
        for (Map.Entry<String, String> entry : tokens.entrySet()) {
            message = message.replace(entry.getKey(), entry.getValue());
        }
        return message;
    }

    private void sendMessage(MarketingCampaign campaign, Customer customer, String message) {
        MarketingEventLog log = new MarketingEventLog();
        log.setCampaignId(campaign.getCampaignId());
        log.setCustomerId(customer.getId());
        log.setPhoneNumber(customer.getPrimaryPhoneNumber());
        log.setChannel(campaign.getChannel());
        log.setMessagePreview(message.length() > 180 ? message.substring(0, 180) : message);

        try {
            Map<String, Object> response = smsService.sendSms(customer.getPrimaryPhoneNumber(), message);
            log.setStatus(MarketingEventLog.DeliveryStatus.SENT);
            log.setResponsePayload(response != null ? response.toString() : "SENT");
        } catch (Exception e) {
            log.setStatus(MarketingEventLog.DeliveryStatus.FAILED);
            log.setResponsePayload(e.getMessage());
        }

        marketingEventLogRepository.save(log);
    }

    private void sendTemplateMessage(String templateId, Customer customer, Map<String, String> extraTokens) {
        if (templateId == null || customer.getPrimaryPhoneNumber() == null) {
            return;
        }
        SmsTemplate template = smsTemplateRepository.findByTemplateId(templateId).orElse(null);
        if (template == null) {
            return;
        }
        Map<String, String> tokens = convertExtras(extraTokens);
        String content = renderTemplate(template.getContentBody(), customer, null, tokens);
        try {
            smsService.sendSms(customer.getPrimaryPhoneNumber(), content);
            MarketingEventLog log = new MarketingEventLog();
            log.setCampaignId(templateId);
            log.setCustomerId(customer.getId());
            log.setPhoneNumber(customer.getPrimaryPhoneNumber());
            log.setChannel("SMS");
            log.setMessagePreview(content.length() > 180 ? content.substring(0, 180) : content);
            log.setStatus(MarketingEventLog.DeliveryStatus.SENT);
            marketingEventLogRepository.save(log);
        } catch (Exception e) {
            MarketingEventLog log = new MarketingEventLog();
            log.setCampaignId(templateId);
            log.setCustomerId(customer.getId());
            log.setPhoneNumber(customer.getPrimaryPhoneNumber());
            log.setChannel("SMS");
            log.setMessagePreview(content.length() > 180 ? content.substring(0, 180) : content);
            log.setStatus(MarketingEventLog.DeliveryStatus.FAILED);
            log.setResponsePayload(e.getMessage());
            marketingEventLogRepository.save(log);
        }
    }

    private Map<String, String> convertExtras(Map<String, String> extraTokens) {
        if (extraTokens == null || extraTokens.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<String, String> converted = new HashMap<>();
        extraTokens.forEach((key, value) -> converted.put("{{" + key + "}}", value));
        return converted;
    }

    private int extractIntCondition(String json, String key, int defaultValue) {
        if (json == null || json.isBlank()) {
            return defaultValue;
        }
        try {
            JsonNode node = objectMapper.readTree(json);
            if (node.has(key)) {
                return node.get(key).asInt(defaultValue);
            }
        } catch (Exception ignored) {
        }
        return defaultValue;
    }
}

