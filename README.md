KTBC 2026 — Digital Registration & Check-In System

Executive Summary

This repository contains the frontend PWA for the KTBC 2026 Digital Registration & Check-In System. The system is designed to register, manage parental consent, generate QR passes, and support fast camera-based check-in for 4,000+ attendees. The PWA is mobile-first, accessible, and supports offline-capable check-in workflows.

Project Objectives
- Manage 4,000+ attendees
- Enforce parental consent for minors
- Prevent duplicate entry during check-in
- Enable fast QR check-in with offline queuing

System Architecture Overview
- Frontend: React + Vite + Tailwind (this PWA)
- Backend: Node.js APIs (recommended)
- Database: Supabase / PostgreSQL (or equivalent)
- Messaging: WhatsApp + SMS integration for QR distribution

Core Components
- Registration System (multi-step, consent)
- Consent System (parental OTP verification)
- QR Generator (per-attendee QR passes)
- Scanner App (camera-based QR scanner with offline queue)
- Admin Dashboard (overview, registrations, reports)
- Help Desk (lookup and attendee support)

Database Tables (suggested)
- camper_registrations
- parental_consents
- qr_passes
- event_checkins
- staff_users
- audit_logs

Quick start

1. Install dependencies

   npm install --legacy-peer-deps

2. Run dev server

   npm run dev

