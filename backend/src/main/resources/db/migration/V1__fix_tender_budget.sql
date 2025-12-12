-- Make budget column nullable in tenders table
ALTER TABLE tenders MODIFY COLUMN budget DECIMAL(38,2) NULL;
