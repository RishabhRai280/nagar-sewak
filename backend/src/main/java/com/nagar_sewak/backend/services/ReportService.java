package com.nagar_sewak.backend.services;

import com.itextpdf.html2pdf.HtmlConverter;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final TemplateEngine templateEngine;
    private final ComplaintRepository complaintRepository;
    private final ProjectRepository projectRepository;

    public byte[] generatePDFReport(Map<String, Object> reportData) {
        try {
            String type = (String) reportData.get("type");
            Object idObj = reportData.get("id");
            
            if (type == null || idObj == null) {
                throw new IllegalArgumentException("Type and ID are required for PDF generation");
            }
            
            Long id = idObj instanceof Number ? ((Number) idObj).longValue() : Long.parseLong(idObj.toString());
            
            log.info("Generating PDF report for type: {} with ID: {}", type, id);
            
            Context context = new Context();
            context.setVariable("reportData", reportData);
            context.setVariable("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")));
            
            String htmlContent;
            
            if ("complaint".equals(type)) {
                Optional<Complaint> complaintOpt = complaintRepository.findById(id);
                if (complaintOpt.isPresent()) {
                    Complaint complaint = complaintOpt.get();
                    context.setVariable("complaint", complaint);
                    context.setVariable("item", complaint);
                    log.debug("Using complaint from database: {}", complaint.getTitle());
                } else {
                    log.warn("Complaint not found in database with ID: {}, using provided data", id);
                    // Ensure we have the required fields from reportData
                    Map<String, Object> itemData = new HashMap<>(reportData);
                    if (!itemData.containsKey("lat") || !itemData.containsKey("lng")) {
                        itemData.put("lat", 0.0);
                        itemData.put("lng", 0.0);
                    }
                    context.setVariable("complaint", null);
                    context.setVariable("item", itemData);
                }
                htmlContent = templateEngine.process("reports/complaint-report", context);
            } else if ("project".equals(type)) {
                Optional<Project> projectOpt = projectRepository.findById(id);
                if (projectOpt.isPresent()) {
                    Project project = projectOpt.get();
                    context.setVariable("project", project);
                    context.setVariable("item", project);
                    log.debug("Using project from database: {}", project.getTitle());
                } else {
                    log.warn("Project not found in database with ID: {}, using provided data", id);
                    // Ensure we have the required fields from reportData
                    Map<String, Object> itemData = new HashMap<>(reportData);
                    if (!itemData.containsKey("lat") || !itemData.containsKey("lng")) {
                        itemData.put("lat", 0.0);
                        itemData.put("lng", 0.0);
                    }
                    context.setVariable("project", null);
                    context.setVariable("item", itemData);
                }
                htmlContent = templateEngine.process("reports/project-report", context);
            } else {
                throw new IllegalArgumentException("Unknown report type: " + type + ". Supported types: complaint, project");
            }
            
            if (htmlContent == null || htmlContent.trim().isEmpty()) {
                throw new RuntimeException("Generated HTML content is empty");
            }
            
            log.debug("Generated HTML content length: {}", htmlContent.length());
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            
            try {
                HtmlConverter.convertToPdf(htmlContent, outputStream);
            } catch (Exception pdfException) {
                log.error("PDF conversion failed. HTML content preview: {}", 
                    htmlContent.length() > 500 ? htmlContent.substring(0, 500) + "..." : htmlContent);
                throw new RuntimeException("PDF conversion failed: " + pdfException.getMessage(), pdfException);
            }
            
            byte[] pdfBytes = outputStream.toByteArray();
            
            if (pdfBytes.length == 0) {
                throw new RuntimeException("Generated PDF is empty");
            }
            
            log.info("Successfully generated PDF report with {} bytes", pdfBytes.length);
            
            return pdfBytes;
            
        } catch (Exception e) {
            log.error("Error generating PDF report for type: {} with ID: {}", 
                reportData.get("type"), reportData.get("id"), e);
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> exportItemData(String type, Long id) {
        Map<String, Object> exportData = new HashMap<>();
        exportData.put("exportedAt", LocalDateTime.now());
        exportData.put("type", type);
        
        if ("complaint".equals(type)) {
            Optional<Complaint> complaintOpt = complaintRepository.findById(id);
            if (complaintOpt.isPresent()) {
                Complaint complaint = complaintOpt.get();
                exportData.put("data", complaint);
            } else {
                throw new RuntimeException("Complaint not found with ID: " + id);
            }
        } else if ("project".equals(type)) {
            Optional<Project> projectOpt = projectRepository.findById(id);
            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();
                exportData.put("data", project);
            } else {
                throw new RuntimeException("Project not found with ID: " + id);
            }
        } else {
            throw new RuntimeException("Unknown export type: " + type);
        }
        
        return exportData;
    }
}