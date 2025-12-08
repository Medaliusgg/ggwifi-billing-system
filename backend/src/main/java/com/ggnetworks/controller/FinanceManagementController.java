package com.ggnetworks.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ggnetworks.entity.Expense;
import com.ggnetworks.entity.Payment;
import com.ggnetworks.service.BudgetService;
import com.ggnetworks.service.ExpenseService;
import com.ggnetworks.service.ProfitService;
import com.ggnetworks.service.RentService;
import com.ggnetworks.service.SalaryService;
import com.ggnetworks.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/v1/admin/finance")
public class FinanceManagementController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private SalaryService salaryService;

    @Autowired
    private RentService rentService;

    @Autowired
    private ProfitService profitService;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> getFinanceOverview() {
        Map<String, Object> data = new HashMap<>();

        BigDecimal totalIncome = sumPayments();
        BigDecimal totalExpenses = sumExpenses();
        BigDecimal netProfit = totalIncome.subtract(totalExpenses);

        Map<String, Object> budgetStats = budgetService.getBudgetStatistics();
        double budgetUtilization = calculateBudgetUtilization(budgetStats);

        data.put("totalIncome", totalIncome);
        data.put("totalExpenses", totalExpenses);
        data.put("netProfit", netProfit);
        data.put("budgetUtilization", budgetUtilization);
        data.put("expenseStats", expenseService.getExpenseStatistics());
        data.put("salaryStats", salaryService.getSalaryStatistics());
        data.put("rentStats", rentService.getRentStatistics());
        data.put("profitStats", profitService.getProfitStatistics());
        data.put("recentTransactions", buildTransactionsList(10));

        return successResponse(data);
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> getTransactions() {
        return successResponse(buildTransactionsList(200));
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> createTransaction(@RequestBody FinanceTransactionRequest request) {
        if ("INCOME".equalsIgnoreCase(request.getType())) {
            return errorResponse("Manual income entries are not supported. Income data is sourced from customer payments.", HttpStatus.BAD_REQUEST);
        }

        Expense expense = new Expense();
        applyRequestToExpense(expense, request);
        Expense saved = expenseService.createExpense(expense);

        return successResponse(mapExpenseToDto(saved));
    }

    @PutMapping("/transactions/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> updateTransaction(
            @PathVariable Long id,
            @RequestBody FinanceTransactionRequest request) {

        Optional<Expense> existingOpt = expenseService.getExpenseById(id);
        if (existingOpt.isEmpty()) {
            return errorResponse("Expense transaction not found", HttpStatus.NOT_FOUND);
        }

        Expense existing = existingOpt.get();
        applyRequestToExpense(existing, request);
        Expense saved = expenseService.updateExpense(existing);

        return successResponse(mapExpenseToDto(saved));
    }

    @DeleteMapping("/transactions/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> deleteTransaction(@PathVariable Long id) {
        Optional<Expense> existingOpt = expenseService.getExpenseById(id);
        if (existingOpt.isEmpty()) {
            return errorResponse("Expense transaction not found", HttpStatus.NOT_FOUND);
        }

        expenseService.deleteExpense(id);
        Map<String, Object> payload = new HashMap<>();
        payload.put("deleted", true);
        payload.put("id", id);
        return successResponse(payload);
    }

    @GetMapping("/budgets")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FINANCE')")
    public ResponseEntity<Map<String, Object>> getBudgets() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("items", budgetService.getAllBudgets());
        payload.put("stats", budgetService.getBudgetStatistics());
        return successResponse(payload);
    }

    private List<FinanceTransactionResponse> buildTransactionsList(int limit) {
        List<FinanceTransactionResponse> expenses = expenseService.getAllExpenses().stream()
                .map(this::mapExpenseToDto)
                .collect(Collectors.toList());

        List<FinanceTransactionResponse> incomes = paymentRepository.findByStatus(Payment.PaymentStatus.SUCCESSFUL).stream()
                .map(this::mapPaymentToDto)
                .collect(Collectors.toList());

        List<FinanceTransactionResponse> completedPayments = paymentRepository.findByStatus(Payment.PaymentStatus.COMPLETED).stream()
                .map(this::mapPaymentToDto)
                .collect(Collectors.toList());

        return Stream.concat(expenses.stream(), Stream.concat(incomes.stream(), completedPayments.stream()))
                .sorted(Comparator.comparing(FinanceTransactionResponse::getDate, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private FinanceTransactionResponse mapExpenseToDto(Expense expense) {
        String category = expense.getCategory() != null ? expense.getCategory().name() : "GENERAL";
        String paymentMethod = expense.getPaymentMethod() != null ? expense.getPaymentMethod().name() : "CASH";
        String status = expense.getStatus() != null ? expense.getStatus().name() : "PENDING";
        String type = Optional.ofNullable(extractTypeFromTags(expense.getTags())).orElse("EXPENSE");

        return new FinanceTransactionResponse(
                expense.getId(),
                expense.getExpenseId(),
                expense.getTitle(),
                type,
                category,
                expense.getAmount(),
                expense.getCurrency(),
                paymentMethod,
                expense.getExpenseDate(),
                status,
                expense.getDescription(),
                expense.getReceiptNumber(),
                expense.getTags(),
                "EXPENSE",
                true
        );
    }

    private FinanceTransactionResponse mapPaymentToDto(Payment payment) {
        String reference = payment.getPaymentId();
        String title = payment.getDescription() != null ? payment.getDescription() : "Customer Payment";
        String category = payment.getPaymentGateway() != null ? payment.getPaymentGateway().toUpperCase() : "PAYMENT";
        String paymentMethod = payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : "MOBILE_MONEY";
        String status = payment.getStatus() != null ? payment.getStatus().name() : "PENDING";
        String description = payment.getCustomer() != null ?
                "Customer #" + payment.getCustomer().getId() :
                payment.getPhoneNumber();

        return new FinanceTransactionResponse(
                payment.getId(),
                reference,
                title,
                "INCOME",
                category,
                payment.getAmount(),
                payment.getCurrency(),
                paymentMethod,
                payment.getCreatedAt(),
                status,
                description,
                payment.getGatewayReference(),
                payment.getPhoneNumber(),
                "PAYMENT",
                false
        );
    }

    private void applyRequestToExpense(Expense expense, FinanceTransactionRequest request) {
        expense.setTitle(request.getTitle() != null ? request.getTitle() : defaultTitle(request.getCategory()));
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO);
        expense.setCurrency(request.getCurrency() != null ? request.getCurrency() : "TZS");
        expense.setCategory(resolveExpenseCategory(request.getCategory()));
        expense.setPaymentMethod(resolvePaymentMethod(request.getPaymentMethod()));
        expense.setExpenseDate(parseDate(request.getDate()));
        expense.setReceiptNumber(request.getReference());
        expense.setNotes(request.getNotes());
        expense.setIsRecurring(request.isRecurring());
        expense.setRecurringFrequency(request.getRecurringInterval());
        expense.setTags(mergeTags(stripTypeFromTags(expense.getTags()), request.getTags(), request.getType()));
        expense.setStatus(Expense.ExpenseStatus.APPROVED);
    }

    private Expense.ExpenseCategory resolveExpenseCategory(String value) {
        if (value == null || value.isBlank()) {
            return Expense.ExpenseCategory.OTHER;
        }
        try {
            return Expense.ExpenseCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // Map common aliases
            return switch (value.toUpperCase()) {
                case "SALARY" -> Expense.ExpenseCategory.SALARIES;
                case "TRAVEL" -> Expense.ExpenseCategory.TRANSPORT;
                case "EDUCATION" -> Expense.ExpenseCategory.TRAINING;
                case "SOFTWARE_SUBSCRIPTION" -> Expense.ExpenseCategory.SOFTWARE;
                case "HARDWARE_PURCHASE" -> Expense.ExpenseCategory.HARDWARE;
                default -> Expense.ExpenseCategory.OTHER;
            };
        }
    }

    private Expense.PaymentMethod resolvePaymentMethod(String value) {
        if (value == null || value.isBlank()) {
            return Expense.PaymentMethod.CASH;
        }
        try {
            return Expense.PaymentMethod.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return Expense.PaymentMethod.CASH;
        }
    }

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) {
            return LocalDateTime.now();
        }
        try {
            if (value.length() == 10) {
                LocalDate date = LocalDate.parse(value);
                return date.atStartOfDay();
            }
            return LocalDateTime.parse(value);
        } catch (Exception ex) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
                return LocalDateTime.parse(value, formatter);
            } catch (Exception ignored) {
                return LocalDateTime.now();
            }
        }
    }

    private String mergeTags(String existingTags, String newTags, String type) {
        List<String> parts = new ArrayList<>();
        if (type != null && !type.isBlank()) {
            parts.add("type=" + type.toUpperCase());
        } else if (existingTags != null) {
            String existingType = extractTypeFromTags(existingTags);
            if (existingType != null) {
                parts.add("type=" + existingType);
            }
        }

        if (newTags != null && !newTags.isBlank()) {
            parts.add(newTags);
        } else if (existingTags != null) {
            String stripped = stripTypeFromTags(existingTags);
            if (stripped != null && !stripped.isBlank()) {
                parts.add(stripped);
            }
        }

        return parts.isEmpty() ? null : String.join("|", parts);
    }

    private String extractTypeFromTags(String tags) {
        if (tags == null) {
            return null;
        }
        for (String part : tags.split("\\|")) {
            if (part.toLowerCase().startsWith("type=")) {
                return part.substring(5).trim().toUpperCase();
            }
        }
        return null;
    }

    private String stripTypeFromTags(String tags) {
        if (tags == null) {
            return null;
        }
        return Stream.of(tags.split("\\|"))
                .filter(part -> !part.toLowerCase().startsWith("type="))
                .collect(Collectors.joining("|"));
    }

    private double calculateBudgetUtilization(Map<String, Object> budgetStats) {
        if (budgetStats == null) {
            return 0d;
        }
        BigDecimal totalBudget = toBigDecimal(budgetStats.get("totalBudgetAmount"));
        BigDecimal totalSpent = toBigDecimal(budgetStats.get("totalSpentAmount"));
        if (totalBudget.compareTo(BigDecimal.ZERO) <= 0) {
            return 0d;
        }
        return totalSpent
                .divide(totalBudget, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private BigDecimal sumPayments() {
        return Stream.concat(
                        paymentRepository.findByStatus(Payment.PaymentStatus.SUCCESSFUL).stream(),
                        paymentRepository.findByStatus(Payment.PaymentStatus.COMPLETED).stream()
                )
                .map(payment -> payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumExpenses() {
        return expenseService.getAllExpenses().stream()
                .map(expense -> expense.getAmount() != null ? expense.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return BigDecimal.ZERO;
    }

    private String defaultTitle(String category) {
        return category != null ? category + " Expense" : "General Expense";
    }

    private ResponseEntity<Map<String, Object>> successResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> errorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }

    // DTOs
    public static class FinanceTransactionRequest {
        private String title;
        private String type;
        private String category;
        private BigDecimal amount;
        private String currency;
        private String paymentMethod;
        private String reference;
        private String description;
        private String date;
        @JsonProperty("isRecurring")
        private boolean recurring;
        private String recurringInterval;
        private String notes;
        private String tags;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getReference() { return reference; }
        public void setReference(String reference) { this.reference = reference; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public boolean isRecurring() { return recurring; }
        public void setRecurring(boolean recurring) { this.recurring = recurring; }

        public String getRecurringInterval() { return recurringInterval; }
        public void setRecurringInterval(String recurringInterval) { this.recurringInterval = recurringInterval; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }
    }

    public static class FinanceTransactionResponse {
        private final Long id;
        private final String reference;
        private final String title;
        private final String type;
        private final String category;
        private final BigDecimal amount;
        private final String currency;
        private final String paymentMethod;
        private final LocalDateTime date;
        private final String status;
        private final String description;
        private final String referenceDetails;
        private final String tags;
        private final String source;
        private final boolean editable;

        public FinanceTransactionResponse(Long id,
                                          String reference,
                                          String title,
                                          String type,
                                          String category,
                                          BigDecimal amount,
                                          String currency,
                                          String paymentMethod,
                                          LocalDateTime date,
                                          String status,
                                          String description,
                                          String referenceDetails,
                                          String tags,
                                          String source,
                                          boolean editable) {
            this.id = id;
            this.reference = reference;
            this.title = title;
            this.type = type;
            this.category = category;
            this.amount = amount;
            this.currency = currency;
            this.paymentMethod = paymentMethod;
            this.date = date;
            this.status = status;
            this.description = description;
            this.referenceDetails = referenceDetails;
            this.tags = tags;
            this.source = source;
            this.editable = editable;
        }

        public Long getId() { return id; }
        public String getReference() { return reference; }
        public String getTitle() { return title; }
        public String getType() { return type; }
        public String getCategory() { return category; }
        public BigDecimal getAmount() { return amount; }
        public String getCurrency() { return currency; }
        public String getPaymentMethod() { return paymentMethod; }
        public LocalDateTime getDate() { return date; }
        public String getStatus() { return status; }
        public String getDescription() { return description; }
        public String getReferenceDetails() { return referenceDetails; }
        public String getTags() { return tags; }
        public String getSource() { return source; }
        public boolean isEditable() { return editable; }
    }
}

