package com.nagar_sewak.backend.services;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.nagar_sewak.backend.entities.Tender;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.Complaint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    private static final DateTimeFormatter DATE_ONLY_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");
    
    // Color scheme
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(33, 150, 243); // Blue
    private static final DeviceRgb SECONDARY_COLOR = new DeviceRgb(76, 175, 80); // Green
    private static final DeviceRgb HEADER_BG = new DeviceRgb(245, 245, 245); // Light gray
    private static final DeviceRgb TEXT_COLOR = new DeviceRgb(51, 51, 51); // Dark gray

    public byte[] generateTenderPdf(Tender tender) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add margins
            document.setMargins(40, 40, 40, 40);

            // Header with logo/title
            Paragraph header = new Paragraph("NAGAR SEWAK")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(PRIMARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);
            
            Paragraph subHeader = new Paragraph("Tender Notification Document")
                    .setFontSize(16)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subHeader);
            
            // Horizontal line
            document.add(new Paragraph("\n").setBorderBottom(new SolidBorder(PRIMARY_COLOR, 2)));

            // Tender ID Badge
            Paragraph tenderIdBadge = new Paragraph("Tender ID: #" + tender.getId())
                    .setFontSize(14)
                    .setBold()
                    .setFontColor(ColorConstants.WHITE)
                    .setBackgroundColor(PRIMARY_COLOR)
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(15)
                    .setMarginBottom(15);
            document.add(tenderIdBadge);

            // Main Details Section
            Paragraph sectionTitle = new Paragraph("Tender Details")
                    .setFontSize(16)
                    .setBold()
                    .setFontColor(PRIMARY_COLOR)
                    .setMarginTop(10)
                    .setMarginBottom(10);
            document.add(sectionTitle);

            // Tender Details Table with improved styling
            Table table = new Table(UnitValue.createPercentArray(new float[]{35, 65}));
            table.setWidth(UnitValue.createPercentValue(100));

            addStyledTableRow(table, "Title", tender.getTitle() != null ? tender.getTitle() : "N/A", true);
            addStyledTableRow(table, "Description", tender.getDescription() != null ? tender.getDescription() : "N/A", false);
            
            if (tender.getBudget() != null) {
                addStyledTableRow(table, "Budget", "₹ " + String.format("%,.2f", tender.getBudget()), true);
            }
            
            if (tender.getQuoteAmount() != null) {
                addStyledTableRow(table, "Quote Amount", "₹ " + String.format("%,.2f", tender.getQuoteAmount()), true);
            }
            
            if (tender.getStartDate() != null) {
                addStyledTableRow(table, "Bid Start Date", tender.getStartDate().format(DATE_ONLY_FORMATTER), false);
            }
            
            if (tender.getEndDate() != null) {
                addStyledTableRow(table, "Bid End Date", tender.getEndDate().format(DATE_ONLY_FORMATTER), true);
            }
            
            if (tender.getEstimatedDays() != null) {
                addStyledTableRow(table, "Estimated Days", tender.getEstimatedDays() + " days", false);
            }
            
            addStyledTableRow(table, "Status", tender.getStatus() != null ? tender.getStatus() : "N/A", true);
            
            if (tender.getComplaint() != null) {
                addStyledTableRow(table, "Related Complaint", "#" + tender.getComplaint().getId() + " - " + tender.getComplaint().getTitle(), false);
            }
            
            if (tender.getContractor() != null) {
                addStyledTableRow(table, "Contractor", tender.getContractor().getCompanyName(), true);
                addStyledTableRow(table, "License No", tender.getContractor().getLicenseNo(), false);
            }

            document.add(table);

            // Footer
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("\n").setBorderTop(new SolidBorder(HEADER_BG, 1)));
            
            Paragraph footer = new Paragraph("This is an official document generated by Nagar Sewak System")
                    .setFontSize(9)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(10);
            document.add(footer);
            
            Paragraph timestamp = new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DATE_FORMATTER))
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(timestamp);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating tender PDF", e);
            return new byte[0];
        }
    }

    public byte[] generateProjectPdf(Project project) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(40, 40, 40, 40);

            // Header
            Paragraph header = new Paragraph("NAGAR SEWAK")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);
            
            Paragraph subHeader = new Paragraph("Project Information Document")
                    .setFontSize(16)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subHeader);
            
            document.add(new Paragraph("\n").setBorderBottom(new SolidBorder(SECONDARY_COLOR, 2)));

            // Project ID Badge
            Paragraph projectIdBadge = new Paragraph("Project ID: #" + project.getId())
                    .setFontSize(14)
                    .setBold()
                    .setFontColor(ColorConstants.WHITE)
                    .setBackgroundColor(SECONDARY_COLOR)
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(15)
                    .setMarginBottom(15);
            document.add(projectIdBadge);

            // Main Details
            Paragraph sectionTitle = new Paragraph("Project Details")
                    .setFontSize(16)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setMarginTop(10)
                    .setMarginBottom(10);
            document.add(sectionTitle);

            Table table = new Table(UnitValue.createPercentArray(new float[]{35, 65}));
            table.setWidth(UnitValue.createPercentValue(100));

            addStyledTableRow(table, "Title", project.getTitle() != null ? project.getTitle() : "N/A", true);
            addStyledTableRow(table, "Description", project.getDescription() != null ? project.getDescription() : "N/A", false);
            addStyledTableRow(table, "Status", project.getStatus() != null ? project.getStatus() : "N/A", true);
            
            if (project.getBudget() != null) {
                addStyledTableRow(table, "Budget", "₹ " + String.format("%,.2f", project.getBudget()), false);
            }
            
            if (project.getProgressPercentage() != null) {
                addStyledTableRow(table, "Progress", project.getProgressPercentage() + "%", true);
            }
            
            if (project.getCreatedAt() != null) {
                addStyledTableRow(table, "Created Date", project.getCreatedAt().format(DATE_FORMATTER), false);
            }
            
            if (project.getUpdatedAt() != null) {
                addStyledTableRow(table, "Last Updated", project.getUpdatedAt().format(DATE_FORMATTER), true);
            }
            
            if (project.getContractor() != null) {
                addStyledTableRow(table, "Contractor", project.getContractor().getCompanyName(), false);
                addStyledTableRow(table, "License No", project.getContractor().getLicenseNo(), true);
            }
            
            if (project.getLat() != null && project.getLng() != null) {
                addStyledTableRow(table, "Location", project.getLat() + ", " + project.getLng(), false);
            }

            document.add(table);

            // Footer
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("\n").setBorderTop(new SolidBorder(HEADER_BG, 1)));
            
            Paragraph footer = new Paragraph("This is an official document generated by Nagar Sewak System")
                    .setFontSize(9)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(10);
            document.add(footer);
            
            Paragraph timestamp = new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DATE_FORMATTER))
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(timestamp);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating project PDF", e);
            return new byte[0];
        }
    }

    public byte[] generateComplaintPdf(Complaint complaint) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(40, 40, 40, 40);

            // Header
            Paragraph header = new Paragraph("NAGAR SEWAK")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(new DeviceRgb(244, 67, 54)) // Red
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);
            
            Paragraph subHeader = new Paragraph("Complaint Report Document")
                    .setFontSize(16)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subHeader);
            
            document.add(new Paragraph("\n").setBorderBottom(new SolidBorder(new DeviceRgb(244, 67, 54), 2)));

            // Complaint ID Badge
            Paragraph complaintIdBadge = new Paragraph("Complaint ID: #" + complaint.getId())
                    .setFontSize(14)
                    .setBold()
                    .setFontColor(ColorConstants.WHITE)
                    .setBackgroundColor(new DeviceRgb(244, 67, 54))
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(15)
                    .setMarginBottom(15);
            document.add(complaintIdBadge);

            // Main Details
            Paragraph sectionTitle = new Paragraph("Complaint Details")
                    .setFontSize(16)
                    .setBold()
                    .setFontColor(new DeviceRgb(244, 67, 54))
                    .setMarginTop(10)
                    .setMarginBottom(10);
            document.add(sectionTitle);

            Table table = new Table(UnitValue.createPercentArray(new float[]{35, 65}));
            table.setWidth(UnitValue.createPercentValue(100));

            addStyledTableRow(table, "Title", complaint.getTitle() != null ? complaint.getTitle() : "N/A", true);
            addStyledTableRow(table, "Description", complaint.getDescription() != null ? complaint.getDescription() : "N/A", false);
            addStyledTableRow(table, "Status", complaint.getStatus() != null ? complaint.getStatus() : "N/A", true);
            addStyledTableRow(table, "Severity Level", String.valueOf(complaint.getSeverity()) + "/10", false);
            
            if (complaint.getLat() != null && complaint.getLng() != null) {
                addStyledTableRow(table, "Location", complaint.getLat() + ", " + complaint.getLng(), true);
            }
            
            if (complaint.getCreatedAt() != null) {
                addStyledTableRow(table, "Submitted Date", 
                    java.time.LocalDateTime.ofInstant(complaint.getCreatedAt(), 
                    java.time.ZoneId.systemDefault()).format(DATE_FORMATTER), false);
            }
            
            if (complaint.getResolvedAt() != null) {
                addStyledTableRow(table, "Resolved Date", 
                    java.time.LocalDateTime.ofInstant(complaint.getResolvedAt(), 
                    java.time.ZoneId.systemDefault()).format(DATE_FORMATTER), true);
            }
            
            if (complaint.getUser() != null) {
                addStyledTableRow(table, "Submitted By", complaint.getUser().getUsername(), false);
            }

            document.add(table);

            // Footer
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("\n").setBorderTop(new SolidBorder(HEADER_BG, 1)));
            
            Paragraph footer = new Paragraph("This is an official document generated by Nagar Sewak System")
                    .setFontSize(9)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(10);
            document.add(footer);
            
            Paragraph timestamp = new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DATE_FORMATTER))
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(timestamp);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating complaint PDF", e);
            return new byte[0];
        }
    }

    public byte[] generateProgressReportPdf(Project project, List<com.nagar_sewak.backend.entities.ProjectMilestone> milestones) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(40, 40, 40, 40);

            // Header
            Paragraph header = new Paragraph("NAGAR SEWAK")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);
            
            Paragraph subHeader = new Paragraph("Project Progress Report")
                    .setFontSize(16)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subHeader);
            
            document.add(new Paragraph("\n").setBorderBottom(new SolidBorder(SECONDARY_COLOR, 2)));

            // Project Info
            Paragraph projectTitle = new Paragraph(project.getTitle())
                    .setFontSize(18)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(15)
                    .setMarginBottom(15);
            document.add(projectTitle);

            // Progress Bar Visual
            Table progressBar = new Table(UnitValue.createPercentArray(new float[]{100}));
            progressBar.setWidth(UnitValue.createPercentValue(100));
            
            Cell progressCell = new Cell()
                    .add(new Paragraph(project.getProgressPercentage() + "% Complete")
                            .setBold()
                            .setFontSize(14)
                            .setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(SECONDARY_COLOR)
                    .setPadding(15)
                    .setTextAlignment(TextAlignment.CENTER);
            progressBar.addCell(progressCell);
            document.add(progressBar);

            document.add(new Paragraph("\n"));

            // Milestone Timeline
            Paragraph timelineTitle = new Paragraph("Progress Timeline")
                    .setFontSize(16)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setMarginTop(10)
                    .setMarginBottom(10);
            document.add(timelineTitle);

            for (com.nagar_sewak.backend.entities.ProjectMilestone milestone : milestones) {
                DeviceRgb milestoneColor = milestone.getStatus().equals("COMPLETED") ? 
                        SECONDARY_COLOR : new DeviceRgb(200, 200, 200);
                
                // Milestone header
                Paragraph milestoneHeader = new Paragraph(milestone.getPercentage() + "% - " + getMilestoneLabel(milestone.getPercentage()))
                        .setFontSize(13)
                        .setBold()
                        .setFontColor(milestoneColor)
                        .setMarginTop(10);
                document.add(milestoneHeader);

                // Milestone details table
                Table milestoneTable = new Table(UnitValue.createPercentArray(new float[]{30, 70}));
                milestoneTable.setWidth(UnitValue.createPercentValue(100));
                milestoneTable.setMarginBottom(10);

                addStyledTableRow(milestoneTable, "Status", milestone.getStatus(), true);
                
                if (milestone.getCompletedAt() != null) {
                    addStyledTableRow(milestoneTable, "Completed", 
                        milestone.getCompletedAt().format(DATE_FORMATTER), false);
                }
                
                if (milestone.getUpdatedBy() != null) {
                    addStyledTableRow(milestoneTable, "Updated By", milestone.getUpdatedBy(), true);
                }
                
                if (milestone.getNotes() != null && !milestone.getNotes().isEmpty()) {
                    addStyledTableRow(milestoneTable, "Notes", milestone.getNotes(), false);
                }
                
                if (milestone.getPhotoUrls() != null && !milestone.getPhotoUrls().isEmpty()) {
                    addStyledTableRow(milestoneTable, "Photos", 
                        milestone.getPhotoUrls().split(",").length + " photo(s) attached", true);
                }

                document.add(milestoneTable);
            }

            // Footer
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("\n").setBorderTop(new SolidBorder(HEADER_BG, 1)));
            
            Paragraph footer = new Paragraph("This is an official progress report generated by Nagar Sewak System")
                    .setFontSize(9)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(10);
            document.add(footer);
            
            Paragraph timestamp = new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DATE_FORMATTER))
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(timestamp);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating progress report PDF", e);
            return new byte[0];
        }
    }

    private String getMilestoneLabel(Integer percentage) {
        return switch (percentage) {
            case 0 -> "Project Started";
            case 25 -> "Foundation Work";
            case 50 -> "Halfway Complete";
            case 75 -> "Almost Done";
            case 100 -> "Project Finished";
            default -> percentage + "% Complete";
        };
    }

    // Helper method for styled table rows with alternating background
    private void addStyledTableRow(Table table, String key, String value, boolean isEven) {
        Cell keyCell = new Cell()
                .add(new Paragraph(key).setBold().setFontSize(11))
                .setBackgroundColor(HEADER_BG)
                .setPadding(8)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);
        
        Cell valueCell = new Cell()
                .add(new Paragraph(value != null ? value : "N/A").setFontSize(11))
                .setBackgroundColor(isEven ? new DeviceRgb(250, 250, 250) : ColorConstants.WHITE)
                .setPadding(8)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);
        
        table.addCell(keyCell);
        table.addCell(valueCell);
    }
}
