-- Rename enum value REPORTED -> APPROVED in comment_status
ALTER TYPE "comment_status" RENAME VALUE 'REPORTED' TO 'APPROVED';
